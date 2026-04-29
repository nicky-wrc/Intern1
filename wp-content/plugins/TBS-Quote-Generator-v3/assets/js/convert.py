
import json

def convert_services(input_file, output_file):
    with open(input_file, 'r') as file:
        data = json.load(file)

    new_data = {}
    
    # Process each category in the data
    for category, packages in data.items():
        new_data[category] = {}
        
        # Assign a unique ID for each package type within a category
        package_id = 1
        for package in packages:
            new_package = {
                "id": package_id,
                "name": package["name"],
                "quantities": "1",
                "price": str(package["prices"][0]),  # Assuming the first price is for the package itself
                "items": []
            }
            
            # Process each item in the package
            item_id = 1
            for item_name, quantity, price in zip(package["items"], package["quantities"], package["prices"][1:]):
                new_package["items"].append({
                    "id": float(f"{package_id}.{item_id}"),
                    "name": item_name,
                    "quantities": str(quantity),
                    "price": str(price)
                })
                item_id += 1

            # Add the transformed package to the new data structure under its category
            new_data[category][package["name"]] = [new_package]
            package_id += 1

    # Write the new data structure to the output JSON file
    with open(output_file, 'w') as file:
        json.dump(new_data, file, indent=4)

# Usage
convert_services('services.json', 'transformed_services.json')
