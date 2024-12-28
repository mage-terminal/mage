from dataclasses import dataclass
from datetime import datetime
from typing import Optional

@dataclass
class PriceData:
    symbol: str
    price: float
    timestamp: datetime
    
@dataclass
class MarketData:
    symbol: str
    market_cap: float
    volume_24h: float
    price_change_24h: float
    timestamp: datetime
    
@dataclass
class CoinInfo:
    symbol: str
    name: str
    description: str
    website: str
    github: str
    twitter: str
    reddit: str
    last_updated: datetime 