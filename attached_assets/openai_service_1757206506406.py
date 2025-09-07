import os
import json
import logging
from typing import Dict, List, Optional
from openai import OpenAI

logger = logging.getLogger(__name__)

class OpenAIService:
    def __init__(self):
        self.api_key = os.environ.get('OPENAI_API_KEY')
        self.organization_id = os.environ.get('OPENAI_ORG_ID')
        
        if not self.api_key:
            raise ValueError("OPENAI_API_KEY environment variable is required")
        
        self.client = OpenAI(
            api_key=self.api_key,
            organization=self.organization_id
        )
    
    def analyze_payment_patterns(self, payment_data: List[Dict]) -> Dict:
        """Analyze payment patterns and provide insights"""
        try:
            # Prepare data summary for analysis
            data_summary = {
                'total_payments': len(payment_data),
                'sectors_involved': list(set([p.get('sector', 'unknown') for p in payment_data])),
                'payment_amounts': [p.get('amount', 0) for p in payment_data],
                'payment_statuses': [p.get('status', 'unknown') for p in payment_data]
            }
            
            prompt = f"""
            Analyze the following PayPal payment data for FAA.ZONE ecosystem and provide insights:
            
            Payment Summary:
            - Total Payments: {data_summary['total_payments']}
            - Sectors: {', '.join(data_summary['sectors_involved'])}
            - Amount Range: ${min(data_summary['payment_amounts']) if data_summary['payment_amounts'] else 0} - ${max(data_summary['payment_amounts']) if data_summary['payment_amounts'] else 0}
            
            Please provide analysis in JSON format with:
            1. Key insights about payment trends
            2. Risk assessment
            3. Optimization recommendations
            4. Sector-specific observations
            
            Focus on enterprise-scale patterns for 7000+ products across 31+ sectors.
            """
            
            response = self.client.chat.completions.create(
                model="gpt-4",  # the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
                messages=[
                    {"role": "system", "content": "You are a financial analyst expert specializing in payment processing and enterprise-scale transaction analysis."},
                    {"role": "user", "content": prompt}
                ],
                response_format={"type": "json_object"},
                max_tokens=1000
            )
            
            return json.loads(response.choices[0].message.content)
            
        except Exception as e:
            logger.error(f"Error analyzing payment patterns: {str(e)}")
            return {
                "error": "Failed to analyze payment patterns",
                "insights": [],
                "recommendations": []
            }
    
    def generate_sector_descriptions(self, sector_name: str, brand_names: List[str]) -> Dict:
        """Generate optimized descriptions for PayPal products based on sector and brands"""
        try:
            prompt = f"""
            Create optimized PayPal product descriptions for the {sector_name} sector in the FAA.ZONE ecosystem.
            
            Brands in this sector: {', '.join(brand_names[:10])}  # Limit for prompt size
            
            Generate JSON with:
            1. sector_description: Brief description for the sector
            2. product_descriptions: Object with optimized descriptions for each brand
            3. suggested_pricing_tiers: Recommended pricing structure
            4. compliance_considerations: Any regulatory notes
            
            Focus on enterprise B2B services and subscription models.
            """
            
            response = self.client.chat.completions.create(
                model="gpt-4",  # the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
                messages=[
                    {"role": "system", "content": "You are a business consultant specializing in SaaS product descriptions and pricing strategies."},
                    {"role": "user", "content": prompt}
                ],
                response_format={"type": "json_object"},
                max_tokens=1500
            )
            
            return json.loads(response.choices[0].message.content)
            
        except Exception as e:
            logger.error(f"Error generating sector descriptions: {str(e)}")
            return {
                "sector_description": f"Enterprise services for {sector_name}",
                "product_descriptions": {},
                "suggested_pricing_tiers": ["basic", "professional", "enterprise"],
                "compliance_considerations": []
            }
    
    def optimize_bulk_processing(self, job_data: Dict) -> Dict:
        """Get AI recommendations for optimizing bulk processing jobs"""
        try:
            prompt = f"""
            Analyze this bulk PayPal processing job and provide optimization recommendations:
            
            Job Details:
            - Job Type: {job_data.get('job_type', 'unknown')}
            - Total Items: {job_data.get('total_items', 0)}
            - Processed: {job_data.get('processed_items', 0)}
            - Failed: {job_data.get('failed_items', 0)}
            - Errors: {len(job_data.get('error_log', []))}
            
            Provide JSON with:
            1. optimization_suggestions: List of specific improvements
            2. batch_size_recommendation: Optimal batch size
            3. retry_strategy: Recommended retry approach
            4. error_analysis: Analysis of failure patterns
            """
            
            response = self.client.chat.completions.create(
                model="gpt-4",  # the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
                messages=[
                    {"role": "system", "content": "You are a system optimization expert specializing in API rate limiting and bulk processing efficiency."},
                    {"role": "user", "content": prompt}
                ],
                response_format={"type": "json_object"},
                max_tokens=800
            )
            
            return json.loads(response.choices[0].message.content)
            
        except Exception as e:
            logger.error(f"Error optimizing bulk processing: {str(e)}")
            return {
                "optimization_suggestions": ["Implement exponential backoff", "Monitor rate limits"],
                "batch_size_recommendation": 50,
                "retry_strategy": "3 attempts with increasing delays",
                "error_analysis": "Unable to analyze errors"
            }
    
    def detect_fraud_patterns(self, transaction_data: List[Dict]) -> Dict:
        """Analyze transactions for potential fraud patterns"""
        try:
            # Prepare transaction summary
            summary = {
                'transaction_count': len(transaction_data),
                'unique_sectors': len(set([t.get('sector', '') for t in transaction_data])),
                'amount_distribution': [t.get('amount', 0) for t in transaction_data],
                'time_patterns': [t.get('timestamp', '') for t in transaction_data]
            }
            
            prompt = f"""
            Analyze these transaction patterns for the FAA.ZONE PayPal integration:
            
            Transaction Summary:
            - Total Transactions: {summary['transaction_count']}
            - Sectors Involved: {summary['unique_sectors']}
            - Amount Range: ${min(summary['amount_distribution']) if summary['amount_distribution'] else 0} - ${max(summary['amount_distribution']) if summary['amount_distribution'] else 0}
            
            Provide fraud risk analysis in JSON format with:
            1. risk_score: 0-100 risk assessment
            2. risk_factors: List of identified risk factors
            3. recommendations: Security recommendations
            4. monitoring_suggestions: What to monitor going forward
            """
            
            response = self.client.chat.completions.create(
                model="gpt-4",  # the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
                messages=[
                    {"role": "system", "content": "You are a fraud detection specialist with expertise in payment processing security."},
                    {"role": "user", "content": prompt}
                ],
                response_format={"type": "json_object"},
                max_tokens=1000
            )
            
            return json.loads(response.choices[0].message.content)
            
        except Exception as e:
            logger.error(f"Error detecting fraud patterns: {str(e)}")
            return {
                "risk_score": 50,
                "risk_factors": ["Unable to analyze"],
                "recommendations": ["Implement standard fraud monitoring"],
                "monitoring_suggestions": ["Monitor transaction patterns"]
            }