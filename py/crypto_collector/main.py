import time
import schedule
from collectors.price_collector import PriceCollector
from collectors.market_collector import MarketCollector
from collectors.info_collector import InfoCollector
from database.db_handler import DatabaseHandler
from analyzers.market_analyzer import MarketAnalyzer
from analyzers.ai_analyzer import AIAnalyzer
from alerts.alert_system import AlertSystem
from exporters.data_exporter import DataExporter
from config.settings import COLLECTION_INTERVAL

def collect_and_analyze_data():
    """Collect, analyze and process cryptocurrency data"""
    price_collector = PriceCollector()
    market_collector = MarketCollector()
    info_collector = InfoCollector()
    db = DatabaseHandler()
    analyzer = MarketAnalyzer()
    ai_analyzer = AIAnalyzer()
    alert_system = AlertSystem()
    exporter = DataExporter()

    try:
        # Collect data
        price_data = price_collector.collect()
        market_data = market_collector.collect()
        info_data = info_collector.collect()
        
        # Analyze market data
        analysis_results = analyzer.calculate_technical_indicators()
        trading_signals = analyzer.generate_signals()
        
        # AI Analysis
        ai_analyses = []
        for coin_data in market_data:
            ai_analysis = ai_analyzer.analyze_market_data(
                coin_data,
                analysis_results[analysis_results['symbol'] == coin_data['symbol']].iloc[0]
            )
            ai_analyses.append(ai_analysis)
        
        # Generate market report
        market_report = ai_analyzer.generate_market_report(ai_analyses)
        
        # Price predictions
        predictions = ai_analyzer.predict_price_movement(
            db.get_historical_data(days=7),
            analysis_results
        )
        
        # Check for alerts
        alerts = alert_system.check_price_alerts(price_data, db.get_latest_prices())
        for alert in alerts:
            alert_system.send_alert(alert)
        
        # Export data
        exporter.export_data(price_data, "prices")
        exporter.export_data(analysis_results, "analysis")
        exporter.export_data(ai_analyses, "ai_analysis")
        exporter.export_data(market_report, "market_report")
        exporter.export_data(predictions, "predictions")
        
        # Store data in database
        db.store_data(price_data, market_data, info_data)
        db.store_analysis(analysis_results)
        db.store_signals(trading_signals)
        db.store_ai_analysis(ai_analyses)
        db.store_market_report(market_report)
        db.store_predictions(predictions)
        
    except Exception as e:
        print(f"Error in data collection and analysis: {e}")

def main():
    print("Starting Crypto Data Collector...")
    
    # Run initial collection
    collect_and_analyze_data()
    
    # Schedule regular collection
    schedule.every(COLLECTION_INTERVAL).minutes.do(collect_and_analyze_data)
    
    while True:
        schedule.run_pending()
        time.sleep(1)

if __name__ == "__main__":
    main() 