import csv
import os

def recalculate_base_price(csv_file_path):
    """
    Recalculate base_price for each row where min_price = 1.18 * base_price
    So new base_price = min_price / 1.18
    """
    # Read the original CSV file
    rows = []
    with open(csv_file_path, 'r', encoding='utf-8') as file:
        reader = csv.reader(file)
        header = next(reader)  # Get the header row
        rows.append(header)
        
        for row in reader:
            if len(row) >= 29:  # Ensure row has enough columns
                # Find the indices for min_price and base_price
                min_price_idx = 22  # min_price column (0-indexed)
                base_price_idx = 27  # base_price column (0-indexed)
                
                try:
                    min_price = float(row[min_price_idx])
                    # Calculate new base_price: min_price / 1.18
                    new_base_price = round(min_price / 1.18, 2)
                    
                    # Update the base_price in the row
                    row[base_price_idx] = str(new_base_price)
                    
                    print(f"Row {len(rows)}: min_price={min_price}, old_base_price={row[base_price_idx]}, new_base_price={new_base_price}")
                    
                except (ValueError, IndexError) as e:
                    print(f"Error processing row {len(rows)}: {e}")
                
                rows.append(row)
    
    # Write the updated CSV file
    output_file_path = csv_file_path.replace('.csv', '_updated.csv')
    with open(output_file_path, 'w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerows(rows)
    
    print(f"\nUpdated CSV saved to: {output_file_path}")
    return output_file_path

if __name__ == "__main__":
    csv_file_path = "strapi-catalog-utility/deg-retail-catalog-utility/retail_items_dev.csv"
    
    if os.path.exists(csv_file_path):
        updated_file = recalculate_base_price(csv_file_path)
        print(f"Base price recalculation completed. Updated file: {updated_file}")
    else:
        print(f"CSV file not found: {csv_file_path}") 