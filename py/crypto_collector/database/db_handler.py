from pymongo import MongoClient
from config.settings import DB_HOST, DB_PORT, DB_NAME

class DatabaseHandler:
    def __init__(self):
        self.client = MongoClient(host=DB_HOST, port=DB_PORT)
        self.db = self.client[DB_NAME]
        
    def store_data(self, price_data, market_data, info_data):
        """Store collected data in MongoDB"""
        try:
            # Store price data
            self.db.prices.insert_many([vars(p) for p in price_data])
            
            # Store market data
            self.db.markets.create_index([('primary_category', 1)])
            self.db.markets.create_index([('secondary_category', 1)])
            self.db.markets.insert_many([vars(m) for m in market_data])
            
            # Store coin info
            self.db.info.insert_many([vars(i) for i in info_data])
            
        except Exception as e:
            raise Exception(f"Failed to store data in database: {e}")
            
    def get_historical_data(self, symbol, start_date, end_date):
        """Retrieve historical data for analysis"""
        query = {
            "symbol": symbol,
            "timestamp": {
                "$gte": start_date,
                "$lte": end_date
            }
        }
        return {
            "prices": list(self.db.prices.find(query)),
            "markets": list(self.db.markets.find(query)),
            "info": list(self.db.info.find({"symbol": symbol}))
        } 
        
    def store_signals(self, signals):
        """Store trading signals"""
        self.db.signals.insert_many(signals)
        
    def store_ai_analysis(self, analyses):
        """Store AI analyses"""
        self.db.ai_analyses.insert_many(analyses)
        
    def store_market_report(self, report):
        """Store market report"""
        self.db.market_reports.insert_one(report)
        
    def store_predictions(self, predictions):
        """Store price predictions"""
        self.db.predictions.insert_many(predictions) 
        
    def get_coins_by_category(self, category: str, include_secondary: bool = True):
        """Get all coins in a specific category"""
        query = {
            '$or': [
                {'primary_category': category},
                {'secondary_category': category} if include_secondary else {}
            ]
        }
        return list(self.db.markets.find(query)) 