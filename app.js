// CSV Table Inspector - Main Application Logic
class CSVInspector {
    constructor() {
        this.data = [];
        this.headers = [];
        this.filteredData = [];
        this.sortColumn = null;
        this.sortDirection = 'asc';
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.getElementById('fileInput').addEventListener('change', (e) => this.handleFileSelect(e));
        document.getElementById('applyFilter').addEventListener('click', () => this.applyFilter());
        document.getElementById('clearFilter').addEventListener('click', () => this.clearFilter());
        document.getElementById('exportCSV').addEventListener('click', () => this.exportData('csv'));
        document.getElementById('exportJSON').addEventListener('click', () => this.exportData('json'));
        document.getElementById('showStats').addEventListener('click', () => this.showStatistics());
        document.getElementById('closeStats').addEventListener('click', () => this.hideStatistics());
        
        // Close modal when clicking outside
        document.getElementById('statsModal').addEventListener('click', (e) => {
            if (e.target.id === 'statsModal') {
                this.hideStatistics();
            }
        });

        // Filter on Enter key
        document.getElementById('filterValue').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.applyFilter();
            }
        });
    }

    handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;

        document.getElementById('fileName').textContent = file.name;

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            this.parseCSV(content);
        };
        reader.readAsText(file);
    }

    parseCSV(content) {
        const lines = content.split('\n').filter(line => line.trim());
        if (lines.length === 0) {
            alert('The CSV file is empty');
            return;
        }

        // Parse headers
        this.headers = this.parseLine(lines[0]);
        
        // Parse data rows
        this.data = [];
        for (let i = 1; i < lines.length; i++) {
            const values = this.parseLine(lines[i]);
            if (values.length === this.headers.length) {
                const row = {};
                this.headers.forEach((header, index) => {
                    row[header] = values[index];
                });
                this.data.push(row);
            }
        }

        this.filteredData = [...this.data];
        this.renderTable();
        this.populateFilterColumn();
        this.showControls();
    }

    parseLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            const nextChar = line[i + 1];

            if (char === '"') {
                if (inQuotes && nextChar === '"') {
                    current += '"';
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }

        result.push(current.trim());
        return result;
    }

    renderTable() {
        const tableHead = document.getElementById('tableHead');
        const tableBody = document.getElementById('tableBody');
        
        // Clear existing content
        tableHead.innerHTML = '';
        tableBody.innerHTML = '';

        // Render headers
        const headerRow = document.createElement('tr');
        this.headers.forEach((header, index) => {
            const th = document.createElement('th');
            th.textContent = header;
            th.classList.add('sortable');
            
            // Add sort class if this column is sorted
            if (this.sortColumn === index) {
                th.classList.add(this.sortDirection === 'asc' ? 'sort-asc' : 'sort-desc');
            }
            
            th.addEventListener('click', () => this.sortTable(index));
            headerRow.appendChild(th);
        });
        tableHead.appendChild(headerRow);

        // Render data rows
        this.filteredData.forEach(row => {
            const tr = document.createElement('tr');
            this.headers.forEach(header => {
                const td = document.createElement('td');
                td.textContent = row[header];
                tr.appendChild(td);
            });
            tableBody.appendChild(tr);
        });

        // Update info
        document.getElementById('rowCount').textContent = `${this.filteredData.length} rows`;
        document.getElementById('columnCount').textContent = `${this.headers.length} columns`;
        
        // Show table
        document.getElementById('tableContainer').classList.remove('hidden');
    }

    sortTable(columnIndex) {
        const header = this.headers[columnIndex];
        
        // Toggle sort direction if clicking the same column
        if (this.sortColumn === columnIndex) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = columnIndex;
            this.sortDirection = 'asc';
        }

        this.filteredData.sort((a, b) => {
            const aValue = a[header];
            const bValue = b[header];

            // Try numeric comparison
            const aNum = parseFloat(aValue);
            const bNum = parseFloat(bValue);
            
            if (!isNaN(aNum) && !isNaN(bNum)) {
                return this.sortDirection === 'asc' ? aNum - bNum : bNum - aNum;
            }

            // String comparison
            const comparison = aValue.localeCompare(bValue);
            return this.sortDirection === 'asc' ? comparison : -comparison;
        });

        this.renderTable();
    }

    populateFilterColumn() {
        const select = document.getElementById('filterColumn');
        select.innerHTML = '<option value="">Select column...</option>';
        
        this.headers.forEach(header => {
            const option = document.createElement('option');
            option.value = header;
            option.textContent = header;
            select.appendChild(option);
        });
    }

    applyFilter() {
        const column = document.getElementById('filterColumn').value;
        const value = document.getElementById('filterValue').value.toLowerCase();

        if (!column || !value) {
            alert('Please select a column and enter a filter value');
            return;
        }

        this.filteredData = this.data.filter(row => {
            return row[column].toLowerCase().includes(value);
        });

        this.renderTable();
    }

    clearFilter() {
        this.filteredData = [...this.data];
        document.getElementById('filterColumn').value = '';
        document.getElementById('filterValue').value = '';
        this.renderTable();
    }

    showControls() {
        document.getElementById('controls').classList.remove('hidden');
    }

    exportData(format) {
        if (this.filteredData.length === 0) {
            alert('No data to export');
            return;
        }

        let content, mimeType, extension;

        if (format === 'csv') {
            content = this.toCSV(this.filteredData);
            mimeType = 'text/csv';
            extension = 'csv';
        } else if (format === 'json') {
            content = JSON.stringify(this.filteredData, null, 2);
            mimeType = 'application/json';
            extension = 'json';
        }

        this.downloadFile(content, `export.${extension}`, mimeType);
    }

    toCSV(data) {
        const headers = this.headers.map(h => this.escapeCSV(h)).join(',');
        const rows = data.map(row => {
            return this.headers.map(header => this.escapeCSV(row[header])).join(',');
        });
        return [headers, ...rows].join('\n');
    }

    escapeCSV(value) {
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
            return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
    }

    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    showStatistics() {
        const statsContent = document.getElementById('statsContent');
        statsContent.innerHTML = '';

        this.headers.forEach(header => {
            const columnData = this.filteredData.map(row => row[header]);
            const stats = this.calculateStats(columnData, header);
            
            const columnDiv = document.createElement('div');
            columnDiv.className = 'stats-column';
            
            const title = document.createElement('h3');
            title.textContent = header;
            columnDiv.appendChild(title);
            
            const statsGrid = document.createElement('div');
            statsGrid.className = 'stats-grid';
            
            Object.entries(stats).forEach(([label, value]) => {
                const statItem = document.createElement('div');
                statItem.className = 'stat-item';
                
                const statLabel = document.createElement('span');
                statLabel.className = 'stat-label';
                statLabel.textContent = label + ':';
                
                const statValue = document.createElement('span');
                statValue.className = 'stat-value';
                statValue.textContent = value;
                
                statItem.appendChild(statLabel);
                statItem.appendChild(statValue);
                statsGrid.appendChild(statItem);
            });
            
            columnDiv.appendChild(statsGrid);
            statsContent.appendChild(columnDiv);
        });

        document.getElementById('statsModal').classList.remove('hidden');
    }

    hideStatistics() {
        document.getElementById('statsModal').classList.add('hidden');
    }

    calculateStats(data, columnName) {
        const stats = {
            'Count': data.length,
            'Unique': new Set(data).size,
            'Empty': data.filter(v => !v || v.trim() === '').length
        };

        // Try to calculate numeric statistics
        const numericData = data.map(v => parseFloat(v)).filter(v => !isNaN(v));
        
        if (numericData.length > 0) {
            stats['Numeric Count'] = numericData.length;
            stats['Min'] = Math.min(...numericData).toFixed(2);
            stats['Max'] = Math.max(...numericData).toFixed(2);
            stats['Average'] = (numericData.reduce((a, b) => a + b, 0) / numericData.length).toFixed(2);
            stats['Sum'] = numericData.reduce((a, b) => a + b, 0).toFixed(2);
        }

        // Find most common value
        const frequency = {};
        data.forEach(value => {
            frequency[value] = (frequency[value] || 0) + 1;
        });
        
        const mostCommon = Object.entries(frequency).sort((a, b) => b[1] - a[1])[0];
        if (mostCommon) {
            stats['Most Common'] = `${mostCommon[0]} (${mostCommon[1]}x)`;
        }

        return stats;
    }
}

// Initialize the application
const app = new CSVInspector();
