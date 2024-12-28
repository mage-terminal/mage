from openai import OpenAI
import pandas as pd
from config.settings import OPENAI_API_KEY, GPT_MODEL, ANALYSIS_PROMPT_TEMPLATE

class AIAnalyzer:
    def __init__(self):
        self.client = OpenAI(api_key=OPENAI_API_KEY)
        
    def analyze_market_data(self, market_data, technical_indicators):
        """Generate AI analysis of market data"""
        try:
            # Prepare data for analysis
            analysis_data = {
                "price": market_data["price"],
                "market_cap": market_data["market_cap"],
                "volume_24h": market_data["volume_24h"],
                "rsi": technical_indicators["rsi"],
                "macd": technical_indicators["macd"]
            }
            
            # Format prompt
            prompt = ANALYSIS_PROMPT_TEMPLATE.format(**analysis_data)
            
            # Get AI analysis
            response = self.client.chat.completions.create(
                model=GPT_MODEL,
                messages=[
                    {"role": "system", "content": "You are a cryptocurrency market analysis expert."},
                    {"role": "user", "content": prompt}
                ]
            )
            
            return {
                "analysis": response.choices[0].message.content,
                "timestamp": pd.Timestamp.now(),
                "coin": market_data["symbol"]
            }
            
        except Exception as e:
            raise Exception(f"AI analysis failed: {e}")
            
    def generate_market_report(self, analyses):
        """Generate comprehensive market report"""
        try:
            report_prompt = f"""
            Based on the following analyses of different cryptocurrencies:
            {analyses}
            
            Please provide:
            1. Overall market sentiment
            2. Key market trends
            3. Major opportunities and risks
            4. Portfolio recommendations
            5. Market outlook for next 24-48 hours
            """
            
            response = self.client.chat.completions.create(
                model=GPT_MODEL,
                messages=[
                    {"role": "system", "content": "You are a cryptocurrency market expert."},
                    {"role": "user", "content": report_prompt}
                ]
            )
            
            return {
                "report": response.choices[0].message.content,
                "timestamp": pd.Timestamp.now()
            }
            
        except Exception as e:
            raise Exception(f"Report generation failed: {e}")
    
    def predict_price_movement(self, historical_data, technical_indicators):
        """Predict price movement using AI"""
        try:
            prediction_prompt = f"""
            Based on the following historical data and technical indicators:
            Historical Prices: {historical_data}
            Technical Indicators: {technical_indicators}
            
            Please predict:
            1. Price direction in next 24 hours
            2. Potential support and resistance levels
            3. Confidence level of prediction
            4. Key factors that could invalidate prediction
            """
            
            response = self.client.chat.completions.create(
                model=GPT_MODEL,
                messages=[
                    {"role": "system", "content": "You are a cryptocurrency price prediction expert."},
                    {"role": "user", "content": prediction_prompt}
                ]
            )
            
            return {
                "prediction": response.choices[0].message.content,
                "timestamp": pd.Timestamp.now()
            }
            
        except Exception as e:
            raise Exception(f"Price prediction failed: {e}") 