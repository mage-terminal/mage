import os
import json
import pandas as pd
from datetime import datetime
from config.settings import EXPORT_PATH, EXPORT_FORMATS

class DataExporter:
    def __init__(self):
        os.makedirs(EXPORT_PATH, exist_ok=True)
        
    def export_data(self, data, data_type):
        """Export data in multiple formats"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        base_filename = f"{data_type}_{timestamp}"
        
        results = {}
        
        if "csv" in EXPORT_FORMATS:
            csv_path = os.path.join(EXPORT_PATH, f"{base_filename}.csv")
            pd.DataFrame(data).to_csv(csv_path, index=False)
            results['csv'] = csv_path
            
        if "json" in EXPORT_FORMATS:
            json_path = os.path.join(EXPORT_PATH, f"{base_filename}.json")
            with open(json_path, 'w') as f:
                json.dump(data, f, indent=2)
            results['json'] = json_path
            
        if "excel" in EXPORT_FORMATS:
            excel_path = os.path.join(EXPORT_PATH, f"{base_filename}.xlsx")
            pd.DataFrame(data).to_excel(excel_path, index=False)
            results['excel'] = excel_path
            
        return results 