import smtplib
from email.mime.text import MIMEText
from config.settings import PRICE_CHANGE_ALERT, VOLUME_CHANGE_ALERT

class AlertSystem:
    def __init__(self, email_config=None):
        self.email_config = email_config
        
    def check_price_alerts(self, current_data, historical_data):
        """Check for significant price changes"""
        alerts = []
        
        for coin in current_data:
            prev_price = historical_data.get(coin['symbol'], {}).get('price', 0)
            if prev_price > 0:
                change_pct = ((coin['price'] - prev_price) / prev_price) * 100
                if abs(change_pct) >= PRICE_CHANGE_ALERT:
                    alerts.append({
                        'type': 'PRICE_ALERT',
                        'symbol': coin['symbol'],
                        'change': change_pct,
                        'message': f"{coin['symbol']} price changed by {change_pct:.2f}%"
                    })
        
        return alerts
    
    def send_alert(self, alert_data):
        """Send alert via email"""
        if not self.email_config:
            print(f"Alert: {alert_data['message']}")
            return
            
        msg = MIMEText(alert_data['message'])
        msg['Subject'] = f"Crypto Alert: {alert_data['type']}"
        msg['From'] = self.email_config['from']
        msg['To'] = self.email_config['to']
        
        try:
            with smtplib.SMTP(self.email_config['smtp_server']) as server:
                server.login(self.email_config['username'], self.email_config['password'])
                server.send_message(msg)
        except Exception as e:
            print(f"Failed to send alert: {e}") 