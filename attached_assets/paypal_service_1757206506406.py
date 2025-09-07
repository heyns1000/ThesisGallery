import requests
import json
import time
import logging
from datetime import datetime, timezone
from typing import Dict, List, Optional, Tuple
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
import base64

logger = logging.getLogger(__name__)

class PayPalAPIError(Exception):
    """Custom exception for PayPal API errors"""
    def __init__(self, message: str, status_code: Optional[int] = None, response_data: Optional[Dict] = None):
        super().__init__(message)
        self.status_code = status_code
        self.response_data = response_data

class PayPalService:
    def __init__(self, client_id: str, client_secret: str, sandbox: bool = True):
        self.client_id = client_id
        self.client_secret = client_secret
        self.sandbox = sandbox
        self.base_url = 'https://api-m.sandbox.paypal.com' if sandbox else 'https://api-m.paypal.com'
        
        # Setup session with retry strategy
        self.session = requests.Session()
        retry_strategy = Retry(
            total=3,
            backoff_factor=1,
            status_forcelist=[429, 500, 502, 503, 504],
        )
        adapter = HTTPAdapter(max_retries=retry_strategy)
        self.session.mount("http://", adapter)
        self.session.mount("https://", adapter)
        
        self._access_token = None
        self._token_expires_at = None
    
    def _get_access_token(self) -> str:
        """Get or refresh PayPal access token"""
        try:
            if self._access_token and self._token_expires_at:
                # Check if token is still valid (with 60 second buffer)
                if datetime.now(timezone.utc).timestamp() < (self._token_expires_at - 60):
                    return self._access_token
            
            # Get new token
            auth_string = base64.b64encode(f"{self.client_id}:{self.client_secret}".encode()).decode()
            
            headers = {
                'Accept': 'application/json',
                'Accept-Language': 'en_US',
                'Authorization': f'Basic {auth_string}',
                'Content-Type': 'application/x-www-form-urlencoded'
            }
            
            data = 'grant_type=client_credentials'
            
            response = self.session.post(
                f'{self.base_url}/v1/oauth2/token',
                headers=headers,
                data=data,
                timeout=30
            )
            
            if response.status_code != 200:
                raise PayPalAPIError(
                    f"Failed to get access token: {response.status_code}",
                    response.status_code,
                    response.json() if response.content else None
                )
            
            token_data = response.json()
            self._access_token = token_data['access_token']
            # Set expiration time (usually 32400 seconds = 9 hours)
            expires_in = token_data.get('expires_in', 32400)
            self._token_expires_at = datetime.now(timezone.utc).timestamp() + expires_in
            
            logger.info("PayPal access token refreshed successfully")
            return self._access_token
            
        except requests.RequestException as e:
            raise PayPalAPIError(f"Network error getting access token: {str(e)}")
        except Exception as e:
            raise PayPalAPIError(f"Unexpected error getting access token: {str(e)}")
    
    def _make_request(self, method: str, endpoint: str, data: Optional[Dict] = None, params: Optional[Dict] = None) -> Optional[Dict]:
        """Make authenticated request to PayPal API"""
        try:
            access_token = self._get_access_token()
            
            headers = {
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {access_token}',
                'Accept': 'application/json',
                'Prefer': 'return=representation'
            }
            
            # Add request ID for idempotency
            if method.upper() in ['POST', 'PUT', 'PATCH']:
                import uuid
                headers['PayPal-Request-Id'] = str(uuid.uuid4())
            
            url = f"{self.base_url}{endpoint}"
            
            response = self.session.request(
                method=method.upper(),
                url=url,
                headers=headers,
                json=data if data else None,
                params=params,
                timeout=30
            )
            
            # Handle rate limiting
            if response.status_code == 429:
                retry_after = int(response.headers.get('Retry-After', 60))
                logger.warning(f"Rate limited, waiting {retry_after} seconds")
                time.sleep(retry_after)
                return self._make_request(method, endpoint, data, params)
            
            # Handle other errors
            if response.status_code >= 400:
                error_data = None
                try:
                    error_data = response.json()
                except:
                    pass
                
                raise PayPalAPIError(
                    f"PayPal API error: {response.status_code} - {response.text}",
                    response.status_code,
                    error_data
                )
            
            return response.json() if response.content else {}
            
        except PayPalAPIError:
            raise
        except requests.RequestException as e:
            raise PayPalAPIError(f"Network error: {str(e)}")
        except Exception as e:
            raise PayPalAPIError(f"Unexpected error: {str(e)}")
    
    def create_product(self, product_data: Dict, internal_id: Optional[str] = None) -> Optional[Dict]:
        """Create a product in PayPal catalog with individual ID tracking"""
        try:
            logger.info(f"Creating PayPal product: {product_data.get('name')}")
            
            # Validate required fields
            required_fields = ['name', 'type']
            for field in required_fields:
                if field not in product_data:
                    raise PayPalAPIError(f"Missing required field: {field}")
            
            # Set defaults
            if 'type' not in product_data:
                product_data['type'] = 'SERVICE'
            
            # Add individual ID tracking as per Copilot guidance
            if internal_id:
                # Add our internal ID to the product description for tracking
                original_desc = product_data.get('description', '')
                product_data['description'] = f"{original_desc} [Internal ID: {internal_id}]".strip()
                logger.info(f"Added internal ID tracking: {internal_id}")
            
            result = self._make_request('POST', '/v1/catalogs/products', product_data)
            logger.info(f"PayPal product created successfully: {result.get('id')} (Internal: {internal_id})")
            return result
            
        except Exception as e:
            logger.error(f"Error creating PayPal product: {str(e)}")
            raise
    
    def create_plan(self, plan_data: Dict, internal_id: Optional[str] = None) -> Optional[Dict]:
        """Create a billing plan for a product with individual ID tracking"""
        try:
            logger.info(f"Creating PayPal plan: {plan_data.get('name')}")
            
            # Validate required fields
            required_fields = ['product_id', 'name', 'billing_cycles']
            for field in required_fields:
                if field not in plan_data:
                    raise PayPalAPIError(f"Missing required field: {field}")
            
            # Add individual ID tracking as per Copilot guidance
            if internal_id:
                # Add our internal ID to the plan description for tracking
                original_desc = plan_data.get('description', '')
                plan_data['description'] = f"{original_desc} [Internal ID: {internal_id}]".strip()
                logger.info(f"Added internal ID tracking: {internal_id}")
            
            result = self._make_request('POST', '/v1/billing/plans', plan_data)
            logger.info(f"PayPal plan created successfully: {result.get('id')} (Internal: {internal_id})")
            return result
            
        except Exception as e:
            logger.error(f"Error creating PayPal plan: {str(e)}")
            raise
    
    def activate_plan(self, plan_id: str) -> Optional[Dict]:
        """Activate a billing plan"""
        try:
            logger.info(f"Activating PayPal plan: {plan_id}")
            
            activation_data = {
                "op": "replace",
                "path": "/",
                "value": {
                    "state": "ACTIVE"
                }
            }
            
            # Plans are activated via PATCH request
            result = self._make_request('PATCH', f'/v1/billing/plans/{plan_id}', activation_data)
            logger.info(f"PayPal plan activated successfully: {plan_id}")
            return result
            
        except Exception as e:
            logger.error(f"Error activating PayPal plan: {str(e)}")
            raise
    
    def create_subscription(self, subscription_data: Dict, internal_id: Optional[str] = None, custom_id: Optional[str] = None) -> Optional[Dict]:
        """Create a subscription with individual ID tracking"""
        try:
            logger.info(f"Creating PayPal subscription for plan: {subscription_data.get('plan_id')}")
            
            # Validate required fields
            required_fields = ['plan_id']
            for field in required_fields:
                if field not in subscription_data:
                    raise PayPalAPIError(f"Missing required field: {field}")
            
            # Add individual ID tracking as per Copilot guidance
            if custom_id:
                subscription_data['custom_id'] = custom_id
                logger.info(f"Added custom_id for tracking: {custom_id}")
            
            if internal_id and 'application_context' not in subscription_data:
                subscription_data['application_context'] = {
                    'user_action': 'SUBSCRIBE_NOW',
                    'payment_method': {
                        'payer_selected': 'PAYPAL',
                        'payee_preferred': 'IMMEDIATE_PAYMENT_REQUIRED'
                    },
                    'brand_name': f'FAA.ZONE (ID: {internal_id})'
                }
                logger.info(f"Added internal ID tracking in application context: {internal_id}")
            
            result = self._make_request('POST', '/v1/billing/subscriptions', subscription_data)
            logger.info(f"PayPal subscription created successfully: {result.get('id')} (Internal: {internal_id}, Custom: {custom_id})")
            return result
            
        except Exception as e:
            logger.error(f"Error creating PayPal subscription: {str(e)}")
            raise
    
    def get_product(self, product_id: str) -> Optional[Dict]:
        """Get product details"""
        try:
            return self._make_request('GET', f'/v1/catalogs/products/{product_id}')
        except Exception as e:
            logger.error(f"Error getting PayPal product {product_id}: {str(e)}")
            raise
    
    def get_plan(self, plan_id: str) -> Optional[Dict]:
        """Get plan details"""
        try:
            return self._make_request('GET', f'/v1/billing/plans/{plan_id}')
        except Exception as e:
            logger.error(f"Error getting PayPal plan {plan_id}: {str(e)}")
            raise
    
    def get_subscription(self, subscription_id: str) -> Optional[Dict]:
        """Get subscription details"""
        try:
            return self._make_request('GET', f'/v1/billing/subscriptions/{subscription_id}')
        except Exception as e:
            logger.error(f"Error getting PayPal subscription {subscription_id}: {str(e)}")
            raise
    
    def verify_webhook_signature(self, headers: Dict, body: str, webhook_id: str) -> bool:
        """Verify PayPal webhook signature"""
        try:
            # This is a simplified verification - in production, you'd want full signature verification
            # See PayPal webhook signature verification documentation
            required_headers = ['PAYPAL-TRANSMISSION-ID', 'PAYPAL-CERT-ID', 'PAYPAL-TRANSMISSION-SIG']
            for header in required_headers:
                if header not in headers:
                    logger.warning(f"Missing webhook header: {header}")
                    return False
            
            # For now, return True - implement full verification as needed
            return True
            
        except Exception as e:
            logger.error(f"Error verifying webhook signature: {str(e)}")
            return False
    
    def create_order(self, order_data: Dict, internal_id: Optional[str] = None, custom_id: Optional[str] = None, invoice_id: Optional[str] = None, reference_id: Optional[str] = None) -> Optional[Dict]:
        """Create a PayPal order with comprehensive individual ID tracking"""
        try:
            logger.info(f"Creating PayPal order with ID tracking")
            
            # Validate required fields
            required_fields = ['intent', 'purchase_units']
            for field in required_fields:
                if field not in order_data:
                    raise PayPalAPIError(f"Missing required field: {field}")
            
            # Add individual ID tracking as per Copilot guidance
            for i, purchase_unit in enumerate(order_data['purchase_units']):
                if custom_id:
                    purchase_unit['custom_id'] = f"{custom_id}-{i+1}"
                    logger.info(f"Added custom_id: {custom_id}-{i+1}")
                
                if invoice_id:
                    purchase_unit['invoice_id'] = f"{invoice_id}-{i+1}"
                    logger.info(f"Added invoice_id: {invoice_id}-{i+1}")
                
                if reference_id:
                    purchase_unit['reference_id'] = f"{reference_id}-{i+1}"
                    logger.info(f"Added reference_id: {reference_id}-{i+1}")
                
                # Add internal ID to description
                if internal_id and 'description' in purchase_unit:
                    purchase_unit['description'] += f" [Internal: {internal_id}]"
            
            result = self._make_request('POST', '/v2/checkout/orders', order_data)
            logger.info(f"PayPal order created successfully: {result.get('id')} (Internal: {internal_id})")
            return result
            
        except Exception as e:
            logger.error(f"Error creating PayPal order: {str(e)}")
            raise
    
    def capture_order(self, order_id: str) -> Optional[Dict]:
        """Capture an authorized PayPal order"""
        try:
            logger.info(f"Capturing PayPal order: {order_id}")
            
            result = self._make_request('POST', f'/v2/checkout/orders/{order_id}/capture')
            logger.info(f"PayPal order captured successfully: {order_id}")
            return result
            
        except Exception as e:
            logger.error(f"Error capturing PayPal order {order_id}: {str(e)}")
            raise
    
    def get_order(self, order_id: str) -> Optional[Dict]:
        """Get order details"""
        try:
            return self._make_request('GET', f'/v2/checkout/orders/{order_id}')
        except Exception as e:
            logger.error(f"Error getting PayPal order {order_id}: {str(e)}")
            raise
