# CSV Table Inspector 📊

A powerful client-side CSV viewer that runs entirely in your browser without any backend. Load, analyze, sort, filter, and export CSV files with ease.

![CSV Table Inspector](https://github.com/user-attachments/assets/eeb0a24c-7ba3-43c3-ae6e-31d1f1394683)

## Features

✨ **Local File Loading** - Load CSV files directly from your computer, no upload to server required  
🔄 **Sorting** - Click column headers to sort data ascending or descending  
🔍 **Filtering** - Filter rows by column values with real-time search  
📊 **Column Statistics** - View detailed statistics for each column including:
  - Count, unique values, empty values
  - Min, max, average, sum (for numeric columns)
  - Most common values and frequency

📤 **Export** - Export filtered/sorted data as CSV or JSON  
🎨 **Beautiful UI** - Modern, responsive design that works on all devices  
⚡ **Fast & Efficient** - Pure JavaScript with no dependencies

## Usage

1. Open `index.html` in your web browser
2. Click "Choose CSV File" and select a CSV file from your computer
3. The data will be displayed in an interactive table

### Sorting
- Click any column header to sort by that column
- Click again to reverse the sort order
- An arrow indicator shows the current sort direction

### Filtering
1. Select a column from the "Filter Column" dropdown
2. Enter a search term in the "Filter Value" field
3. Click "Apply Filter" to filter the data
4. Click "Clear Filter" to reset

### Statistics
- Click "Show Column Stats" to view detailed statistics for each column
- Statistics include count, unique values, numeric statistics (min, max, average), and most common values

### Export
- Click "Export as CSV" to download the current view as a CSV file
- Click "Export as JSON" to download the current view as a JSON file

## Development

To run locally:

```bash
# Clone the repository
git clone https://github.com/BaseMax/csv-table-inspector.git
cd csv-table-inspector

# Start a local server (Python 3)
python3 -m http.server 8080

# Or use Node.js
npx http-server -p 8080

# Open http://localhost:8080 in your browser
```

## Browser Compatibility

Works in all modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

## Technical Details

- **Pure JavaScript** - No frameworks or libraries required
- **Client-side processing** - All operations happen in the browser
- **CSV parsing** - Handles quoted fields, commas, and special characters
- **Responsive design** - Works on desktop, tablet, and mobile devices

## License

MIT License - see [LICENSE](LICENSE) file for details

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
