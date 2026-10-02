import random
import datetime
import csv
import math

def random_generator(seed):
    while True:
        seed = (seed * 9301 + 49297) % 233280
        yield seed / 233280

def generate_supermarket_data(num_records=1000):
    branches = [
        {'branch': 'A', 'city': 'Yangon'},
        {'branch': 'B', 'city': 'Mandalay'},
        {'branch': 'C', 'city': 'Naypyitaw'},
    ]

    product_lines = [
        'Electronic accessories',
        'Fashion accessories',
        'Food and beverages',
        'Health and beauty',
        'Home and lifestyle',
        'Sports and travel',
    ]

    payments = ['Cash', 'Credit card', 'Ewallet']
    customer_types = ['Member', 'Normal']
    genders = ['Female', 'Male']

    # Deterministic generation to match TS file
    rand = random_generator(12345)
    
    def get_random_item(arr):
        idx = math.floor(next(rand) * len(arr))
        return arr[idx]

    records = []
    start_date = datetime.date(2025, 1, 1)
    total_days = 90

    for i in range(1, num_records + 1):
        branch_obj = get_random_item(branches)
        product_line = get_random_item(product_lines)
        customer_type = get_random_item(customer_types)
        gender = get_random_item(genders)
        payment = get_random_item(payments)

        unit_price = round(10 + next(rand) * 89, 2)
        quantity = math.floor(next(rand) * 10) + 1
        cogs = round(unit_price * quantity, 2)
        tax_5_percent = round(cogs * 0.05, 4)
        total = round(cogs + tax_5_percent, 4)
        gross_income = tax_5_percent
        gross_margin_percentage = 4.7619

        day_offset = math.floor(next(rand) * total_days)
        date_obj = start_date + datetime.timedelta(days=day_offset)
        date_str = date_obj.strftime('%Y-%m-%d')

        hour = math.floor(10 + next(rand) * 11)
        minute = math.floor(next(rand) * 60)
        time_str = f"{hour:02d}:{minute:02d}"

        rating = round(4.0 + next(rand) * 6.0, 1)

        invoice_id = f"INV-{branch_obj['branch']}{date_str.replace('-', '')[2:6]}-{1000 + i}"

        records.append({
            'Invoice ID': invoice_id,
            'Branch': branch_obj['branch'],
            'City': branch_obj['city'],
            'Customer type': customer_type,
            'Gender': gender,
            'Product line': product_line,
            'Unit price': unit_price,
            'Quantity': quantity,
            'Tax 5%': tax_5_percent,
            'Total': total,
            'Date': date_str,
            'Time': time_str,
            'Payment': payment,
            'cogs': cogs,
            'gross margin percentage': gross_margin_percentage,
            'gross income': gross_income,
            'Rating': rating
        })

    return records

if __name__ == '__main__':
    data = generate_supermarket_data()
    filename = 'supermarket_sales.csv'
    
    if not data:
        print("No data generated.")
        exit(1)
        
    keys = data[0].keys()
    
    with open(filename, 'w', newline='', encoding='utf-8') as output_file:
        dict_writer = csv.DictWriter(output_file, fieldnames=keys)
        dict_writer.writeheader()
        dict_writer.writerows(data)
        
    print(f"Successfully generated {len(data)} records in {filename}")
