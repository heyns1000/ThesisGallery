"""
Currency Exchange Service for PayPal Integration System

Handles real-time currency conversion for international payments
and multi-currency PayPal transaction processing.
"""

import os
import requests
import logging
from typing import Dict, Optional, List
from decimal import Decimal, ROUND_HALF_UP
from datetime import datetime, timedelta
import json

logger = logging.getLogger(__name__)

class CurrencyExchangeService:
    """Service for handling currency conversion and exchange rates"""
    
    def __init__(self):
        self.api_key = os.environ.get("CURRENCY_EXCHANGE_API_KEY")
        self.base_url = "https://v6.exchangerate-api.com/v6"
        self.cache_duration = 300  # 5 minutes cache
        self._rate_cache = {}
        
        if not self.api_key:
            logger.warning("CURRENCY_EXCHANGE_API_KEY not found in environment variables")
    
    def get_exchange_rate(self, from_currency: str, to_currency: str) -> Optional[float]:
        """
        Get exchange rate between two currencies
        
        Args:
            from_currency: Source currency code (e.g., 'USD')
            to_currency: Target currency code (e.g., 'EUR')
            
        Returns:
            Exchange rate as float, or None if error
        """
        if not self.api_key:
            logger.error("Currency exchange API key not configured")
            return None
        
        # Check cache first
        cache_key = f"{from_currency}_{to_currency}"
        cached_data = self._rate_cache.get(cache_key)
        
        if cached_data and datetime.now() - cached_data['timestamp'] < timedelta(seconds=self.cache_duration):
            return cached_data['rate']
        
        try:
            url = f"{self.base_url}/{self.api_key}/pair/{from_currency}/{to_currency}"
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            
            if data.get('result') == 'success':
                rate = data.get('conversion_rate')
                
                # Cache the result
                self._rate_cache[cache_key] = {
                    'rate': rate,
                    'timestamp': datetime.now()
                }
                
                return rate
            else:
                logger.error(f"Currency API error: {data.get('error-type', 'Unknown error')}")
                return None
                
        except requests.RequestException as e:
            logger.error(f"Error fetching exchange rate from {from_currency} to {to_currency}: {str(e)}")
            return None
        except Exception as e:
            logger.error(f"Unexpected error in currency conversion: {str(e)}")
            return None
    
    def convert_amount(self, amount: float, from_currency: str, to_currency: str) -> Optional[Dict]:
        """
        Convert amount from one currency to another
        
        Args:
            amount: Amount to convert
            from_currency: Source currency code
            to_currency: Target currency code
            
        Returns:
            Dictionary with conversion details or None if error
        """
        if from_currency == to_currency:
            return {
                'original_amount': amount,
                'converted_amount': amount,
                'from_currency': from_currency,
                'to_currency': to_currency,
                'exchange_rate': 1.0,
                'conversion_date': datetime.now().isoformat()
            }
        
        rate = self.get_exchange_rate(from_currency, to_currency)
        if rate is None:
            return None
        
        # Use Decimal for precise currency calculations
        original_decimal = Decimal(str(amount))
        rate_decimal = Decimal(str(rate))
        converted_decimal = (original_decimal * rate_decimal).quantize(
            Decimal('0.01'), rounding=ROUND_HALF_UP
        )
        
        return {
            'original_amount': float(original_decimal),
            'converted_amount': float(converted_decimal),
            'from_currency': from_currency,
            'to_currency': to_currency,
            'exchange_rate': rate,
            'conversion_date': datetime.now().isoformat()
        }
    
    def get_supported_currencies(self) -> List[str]:
        """
        Get list of supported currencies
        
        Returns:
            List of currency codes
        """
        if not self.api_key:
            return []
        
        try:
            url = f"{self.base_url}/{self.api_key}/codes"
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            
            if data.get('result') == 'success':
                return [code[0] for code in data.get('supported_codes', [])]
            else:
                logger.error(f"Error fetching supported currencies: {data.get('error-type')}")
                return []
                
        except Exception as e:
            logger.error(f"Error fetching supported currencies: {str(e)}")
            return []
    
    def get_paypal_supported_currencies(self) -> List[str]:
        """
        Get currencies commonly supported by PayPal
        
        Returns:
            List of PayPal-supported currency codes
        """
        return [
            'USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'SEK', 'NOK', 'DKK',
            'PLN', 'CZK', 'HUF', 'ILS', 'MXN', 'BRL', 'MYR', 'PHP', 'TWD', 'THB',
            'SGD', 'HKD', 'NZD', 'TRY', 'INR', 'RUB'
        ]
    
    def convert_for_paypal(self, amount: float, from_currency: str, target_currency: str = 'USD') -> Optional[Dict]:
        """
        Convert amount to PayPal-compatible currency
        
        Args:
            amount: Amount to convert
            from_currency: Source currency
            target_currency: Target currency (default USD)
            
        Returns:
            Conversion details optimized for PayPal transactions
        """
        paypal_currencies = self.get_paypal_supported_currencies()
        
        if target_currency not in paypal_currencies:
            logger.warning(f"Currency {target_currency} may not be supported by PayPal")
        
        conversion = self.convert_amount(amount, from_currency, target_currency)
        
        if conversion:
            conversion['paypal_compatible'] = target_currency in paypal_currencies
            conversion['recommended_for_paypal'] = target_currency in ['USD', 'EUR', 'GBP']
        
        return conversion
    
    def get_conversion_history(self, currency_pair: str, days: int = 7) -> Optional[Dict]:
        """
        Get historical exchange rates (if API supports it)
        
        Args:
            currency_pair: Currency pair like "USD_EUR"
            days: Number of days of history
            
        Returns:
            Historical rate data or None
        """
        # This would require a premium API plan for most services
        # For now, return current rate as baseline
        from_currency, to_currency = currency_pair.split('_')
        current_rate = self.get_exchange_rate(from_currency, to_currency)
        
        if current_rate:
            return {
                'currency_pair': currency_pair,
                'current_rate': current_rate,
                'historical_data': 'Premium feature - upgrade API plan for historical data',
                'date_range': f"Last {days} days",
                'timestamp': datetime.now().isoformat()
            }
        
        return None

# Global instance
currency_service = CurrencyExchangeService()