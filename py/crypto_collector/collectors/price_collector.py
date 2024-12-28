from utils.api_client import APIClient
from models.crypto_data import PriceData

class PriceCollector:
    def __init__(self):
        self.api_client = APIClient()
        
    def collect(self):
        """Collect current prices for major cryptocurrencies"""
        try:
            # Get price data from API
            response = self.api_client.get_prices()
            
            # Process and format data
            price_data = []
            for coin in response:
                data = PriceData(
                    symbol=coin['symbol'],
                    price=coin['current_price'],
                    timestamp=coin['last_updated']
                )
                price_data.append(data)
                
            return price_data
            
        except Exception as e:
            raise Exception(f"Failed to collect price data: {e}") 