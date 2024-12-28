import pandas as pd
import numpy as np
from ta.trend import MACD
from ta.momentum import RSIIndicator
from ta.volatility import BollingerBands

class MarketAnalyzer:
    def __init__(self, price_data):
        self.df = pd.DataFrame(price_data)
        
    def calculate_technical_indicators(self):
        """Calculate technical indicators for analysis"""
        # Calculate MACD
        macd = MACD(self.df['price'])
        self.df['macd'] = macd.macd()
        self.df['macd_signal'] = macd.macd_signal()
        
        # Calculate RSI
        rsi = RSIIndicator(self.df['price'])
        self.df['rsi'] = rsi.rsi()
        
        # Calculate Bollinger Bands
        bb = BollingerBands(self.df['price'])
        self.df['bb_high'] = bb.bollinger_hband()
        self.df['bb_low'] = bb.bollinger_lband()
        
        return self.df
    
    def generate_signals(self):
        """Generate trading signals based on indicators"""
        signals = []
        
        # MACD signals
        if self.df['macd'].iloc[-1] > self.df['macd_signal'].iloc[-1]:
            signals.append({"indicator": "MACD", "signal": "BUY"})
        elif self.df['macd'].iloc[-1] < self.df['macd_signal'].iloc[-1]:
            signals.append({"indicator": "MACD", "signal": "SELL"})
            
        # RSI signals
        if self.df['rsi'].iloc[-1] < 30:
            signals.append({"indicator": "RSI", "signal": "OVERSOLD"})
        elif self.df['rsi'].iloc[-1] > 70:
            signals.append({"indicator": "RSI", "signal": "OVERBOUGHT"})
            
        return signals 