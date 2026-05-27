/**
 * Object Filter Studio V2 - Main Application
 * Integrates UI, filter engine, and Trimble Connect Viewer API
 */

class ObjectFilterStudio {
    constructor() {
        this.filterEngine = new FilterEngine();
        this.ifcPropertiesManager = new IFCPropertiesManager();

        this.state = {
            filters: [],
            allObjects: [],
            matchedObjects: [],
            filterSetName: 'Default',
            isDirty: false
        };

        this.viewer = null;
        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        this.setupViewer();
        this.loadSavedFilters();
        this.attachEventListeners();
        this.renderFilters();
        this.updateStatus('Ứng dụng sẵn sàng');
    }

    /**
     * Setup Trimble Connect Viewer reference
     */
    setupViewer() {
        // Try to get viewer from global scope
        if (typeof window !== 'undefined') {
            // Attempt to access Trimble Connect API
            if (window.trimbleConnect?.viewer) {
                this.viewer = window.trimbleConnect.viewer;
            } else if (window.viewer) {
                this.viewer = window.viewer;
            }
        }
    }

    /**
     * Attach event listeners to UI elements
     */
    attachEventListeners() {
        // Add group button
        const addGroupBtn = document.getElementById('addGroupBtn');
        if (addGroupBtn) {
            addGroupBtn.addEventListener('click', () => this.addFilterGroup());
        }

        // Apply filter button
        const applyBtn = document.getElementById('applyBtn');
        if (applyBtn) {
            applyBtn.addEventListener('click', () => this.applyFilters());
        }

        // Reset button
        const resetBtn = document.getElementById('resetBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetColors());
        }

        // Save button
        const saveBtn = document.getElementById('saveBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveFilters());
        }

        // Load button
        const loadBtn = document.getElementById('loadBtn');
        if (loadBtn) {
            loadBtn.addEventListener('click', () => this.showLoadModal());
        }

        // Export button
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportFilters());
        }

        // Import button
        const importBtn = document.getElementById('importBtn');
        if (importBtn) {
            importBtn.addEventListener('click', () => {
                document.getElementById('fileInput').click();
            });
        }

        // File input
        const fileInput = document.getElementById('fileInput');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => this.importFiltersFromFile(e));
        }

        // Filter set name
        const filterSetName = document.getElementById('filterSetName');
        if (filterSetName) {
            filterSetName.addEventListener('change', (e) => {
                this.state.filterSetName = e.target.value;
                this.markDirty();
            });
        }
    }

    /**
     * Add a new filter group
     */
    addFilterGroup() {
        const newGroup = {
            id: this.generateId(),
            color: this.generateRandomColor(),
            rows: [
                {
                    id: this.generateId(),
                    category: 'Part',
                    property: 'Prefix',
                    condition: 'Equals',
                    value: '',
                    operator: 'AND'
                }
            ]
        };

        this.state.filters.push(newGroup);
        this.filterEngine.addFilterGroup(newGroup);
        this.renderFilters();
        this.markDirty();
        this.updateStatus('Đã thêm nhóm lọc mới');
    }

    /**
     * Delete a filter group
     */
    deleteFilterGroup(groupId) {
        const index = this.state.filters.findIndex(g => g.id === groupId);
        if (index > -1) {
            this.state.filters.splice(index, 1);
            this.filterEngine.clearFilters();
            this.state.filters.forEach(g => this.filterEngine.addFilterGroup(g));
            this.renderFilters();
            this.markDirty();
            this.updateStatus('Đã xóa nhóm lọc');
        }
    }

    /**
     * Add a row to a filter group
     */
    addRowToGroup(groupId) {
        const group = this.state.filters.find(g => g.id === groupId);
        if (group) {
            const newRow = {
                id: this.generateId(),
                category: 'Part',
                property: 'Prefix',
                condition: 'Equals',
                value: '',
                operator: 'AND'
            };
            group.rows.push(newRow);
            this.renderFilters();
            this.markDirty();
        }
    }

    /**
     * Delete a row from a filter group
     */
    deleteRowFromGroup(groupId, rowId) {
        const group = this.state.filters.find(g => g.id === groupId);
        if (group) {
            group.rows = group.rows.filter(r => r.id !== rowId);
            if (group.rows.length === 0) {
                this.deleteFilterGroup(groupId);
            } else {
                this.renderFilters();
                this.markDirty();
            }
        }
    }

    /**
     * Update filter row value
     */
    updateRowValue(groupId, rowId, field, value) {
        const group = this.state.filters.find(g => g.id === groupId);
        if (group) {
            const row = group.rows.find(r => r.id === rowId);
            if (row) {
                row[field] = value;
                this.markDirty();
            }
        }
    }

    /**
     * Update group color
     */
    updateGroupColor(groupId, color) {
        const group = this.state.filters.find(g => g.id === groupId);
        if (group) {
            group.color = color;
            this.markDirty();
        }
    }

    /**
     * Render all filter groups and rows
     */
    renderFilters() {
        const container = document.getElementById('filterGroups');
        if (!container) return;

        if (this.state.filters.length === 0) {
            container.innerHTML = '<div class="empty-state">Chưa có nhóm lọc. Nhấp "Thêm nhóm lọc" để bắt đầu.</div>';
            return;
        }

        container.innerHTML = this.state.filters.map((group, groupIdx) => `
            <div class="filter-group" data-group-id="${group.id}">
                <div class="group-header">
                    <div class="color-picker-wrapper">
                        <input
                            type="color"
                            class="color-picker-input"
                            value="${group.color}"
                            data-group-id="${group.id}"
                            title="Chọn màu nhóm"
                        >
                    </div>
                    <div class="group-label">Nhóm ${groupIdx + 1}</div>
                    <button class="delete-group-btn" data-group-id="${group.id}">Xóa</button>
                </div>

                <div class="filter-rows">
                    ${group.rows.map((row, rowIdx) => `
                        <div class="filter-row" data-row-id="${row.id}">
                            <select class="category-select" data-group-id="${group.id}" data-row-id="${row.id}" title="Phạm vi">
                                ${this.ifcPropertiesManager.getCategoryOptions().map(cat => `
                                    <option value="${cat}" ${row.category === cat ? 'selected' : ''}>${cat}</option>
                                `).join('')}
                            </select>

                            <select class="property-select" data-group-id="${group.id}" data-row-id="${row.id}" title="Thuộc tính">
                                ${this.ifcPropertiesManager.getPropertyOptions().map(prop => `
                                    <option value="${prop}" ${row.property === prop ? 'selected' : ''}>${prop}</option>
                                `).join('')}
                            </select>

                            <select class="condition-select" data-group-id="${group.id}" data-row-id="${row.id}" title="Điều kiện">
                                ${this.ifcPropertiesManager.getConditionOptions().map(cond => `
                                    <option value="${cond}" ${row.condition === cond ? 'selected' : ''}>${cond}</option>
                                `).join('')}
                            </select>

                            <input
                                type="text"
                                class="value-input"
                                placeholder="Giá trị..."
                                value="${row.value}"
                                data-group-id="${group.id}"
                                data-row-id="${row.id}"
                                title="Giá trị cần so khớp"
                            >

                            ${rowIdx < group.rows.length - 1 ? `
                                <select class="row-operator" data-group-id="${group.id}" data-row-id="${row.id}" title="Toán tử logic">
                                    <option value="AND" ${row.operator === 'AND' ? 'selected' : ''}>AND</option>
                                    <option value="OR" ${row.operator === 'OR' ? 'selected' : ''}>OR</option>
                                </select>
                            ` : ''}

                            <button class="delete-row-btn" data-group-id="${group.id}" data-row-id="${row.id}" title="Xóa hàng">✕</button>
                        </div>
                    `).join('')}
                </div>

                <button class="add-row-btn" data-group-id="${group.id}">+ Thêm điều kiện</button>
            </div>
        `).join('');

        this.attachFilterEventListeners();
    }

    /**
     * Attach event listeners to dynamically created filter elements
     */
    attachFilterEventListeners() {
        // Color picker changes
        document.querySelectorAll('.color-picker-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const groupId = e.target.dataset.groupId;
                this.updateGroupColor(groupId, e.target.value);
            });
        });

        // Category select changes
        document.querySelectorAll('.category-select').forEach(select => {
            select.addEventListener('change', (e) => {
                const groupId = e.target.dataset.groupId;
                const rowId = e.target.dataset.rowId;
                this.updateRowValue(groupId, rowId, 'category', e.target.value);
            });
        });

        // Property select changes
        document.querySelectorAll('.property-select').forEach(select => {
            select.addEventListener('change', (e) => {
                const groupId = e.target.dataset.groupId;
                const rowId = e.target.dataset.rowId;
                this.updateRowValue(groupId, rowId, 'property', e.target.value);
            });
        });

        // Condition select changes
        document.querySelectorAll('.condition-select').forEach(select => {
            select.addEventListener('change', (e) => {
                const groupId = e.target.dataset.groupId;
                const rowId = e.target.dataset.rowId;
                this.updateRowValue(groupId, rowId, 'condition', e.target.value);
            });
        });

        // Value input changes
        document.querySelectorAll('.value-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const groupId = e.target.dataset.groupId;
                const rowId = e.target.dataset.rowId;
                this.updateRowValue(groupId, rowId, 'value', e.target.value);
            });
        });

        // Operator select changes
        document.querySelectorAll('.row-operator').forEach(select => {
            select.addEventListener('change', (e) => {
                const groupId = e.target.dataset.groupId;
                const rowId = e.target.dataset.rowId;
                this.updateRowValue(groupId, rowId, 'operator', e.target.value);
            });
        });

        // Add row button
        document.querySelectorAll('.add-row-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const groupId = e.target.dataset.groupId;
                this.addRowToGroup(groupId);
            });
        });

        // Delete row button
        document.querySelectorAll('.delete-row-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const groupId = e.target.dataset.groupId;
                const rowId = e.target.dataset.rowId;
                this.deleteRowFromGroup(groupId, rowId);
            });
        });

        // Delete group button
        document.querySelectorAll('.delete-group-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const groupId = e.target.dataset.groupId;
                this.deleteFilterGroup(groupId);
            });
        });
    }

    /**
     * Apply filters to the viewer
     */
    async applyFilters() {
        this.updateStatus('Đang áp dụng bộ lọc...');

        try {
            // Load objects from viewer
            this.state.allObjects = await this.ifcPropertiesManager.getObjectsFromViewer(this.viewer);

            // Set objects in filter engine
            this.filterEngine.clearFilters();
            this.state.filters.forEach(g => this.filterEngine.addFilterGroup(g));
            this.filterEngine.setObjects(this.state.allObjects);

            // Evaluate filters
            this.state.matchedObjects = this.filterEngine.evaluateAllObjects();

            // Apply colors to viewer
            await this.colorizeObjects(this.state.matchedObjects);

            // Gray out non-matched objects
            const matchedGuids = new Set(this.state.matchedObjects.map(m => m.guid));
            for (const obj of this.state.allObjects) {
                if (!matchedGuids.has(obj.guid) && this.state.matchedObjects.length > 0) {
                    await this.setObjectOpacity(obj.guid, 0.2);
                }
            }

            // Update statistics
            const stats = this.filterEngine.getStatistics();
            document.getElementById('objectCount').textContent =
                `Các đối tượng được tìm: ${stats.matched} / ${stats.total}`;

            this.updateStatus(`Bộ lọc áp dụng thành công (${stats.matched} / ${stats.total} đối tượng)`);
        } catch (error) {
            console.error('Error applying filters:', error);
            this.updateStatus(`Lỗi: ${error.message}`);
        }
    }

    /**
     * Colorize objects in viewer
     */
    async colorizeObjects(matchedObjects) {
        if (!this.viewer) {
            console.warn('Viewer not available for colorization');
            return;
        }

        for (const { guid, color } of matchedObjects) {
            try {
                // Convert hex to RGB if needed by API
                const rgb = this.hexToRgb(color);

                // Use Trimble Connect API
                if (typeof this.viewer.setObjectColor === 'function') {
                    await this.viewer.setObjectColor(guid, color);
                } else if (typeof this.viewer.colorObject === 'function') {
                    await this.viewer.colorObject(guid, rgb);
                }
            } catch (error) {
                console.warn(`Could not colorize object ${guid}:`, error);
            }
        }
    }

    /**
     * Set object opacity
     */
    async setObjectOpacity(guid, opacity) {
        if (!this.viewer) return;

        try {
            if (typeof this.viewer.setObjectOpacity === 'function') {
                await this.viewer.setObjectOpacity(guid, opacity);
            }
        } catch (error) {
            console.warn(`Could not set opacity for ${guid}:`, error);
        }
    }

    /**
     * Reset colors in viewer
     */
    async resetColors() {
        this.updateStatus('Đang đặt lại màu...');

        try {
            if (this.viewer && typeof this.viewer.resetObjectColors === 'function') {
                await this.viewer.resetObjectColors();
            }

            // Reset opacities
            for (const obj of this.state.allObjects) {
                await this.setObjectOpacity(obj.guid, 1);
            }

            this.state.matchedObjects = [];
            document.getElementById('objectCount').textContent = 'Các đối tượng được tìm: 0 / 0';
            this.updateStatus('Màu đã được đặt lại');
        } catch (error) {
            console.error('Error resetting colors:', error);
            this.updateStatus(`Lỗi: ${error.message}`);
        }
    }

    /**
     * Convert hex color to RGB
     */
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
    }

    /**
     * Save filters to localStorage
     */
    saveFilters() {
        const filterSet = {
            name: this.state.filterSetName,
            timestamp: new Date().toISOString(),
            config: this.state.filters
        };

        const saved = JSON.parse(localStorage.getItem('objectFilterStudio_saved') || '[]');
        const index = saved.findIndex(s => s.name === this.state.filterSetName);

        if (index > -1) {
            saved[index] = filterSet;
        } else {
            saved.push(filterSet);
        }

        localStorage.setItem('objectFilterStudio_saved', JSON.stringify(saved));
        this.state.isDirty = false;
        this.updateStatus(`Bộ lọc "${this.state.filterSetName}" đã được lưu`);
    }

    /**
     * Load filters from localStorage
     */
    loadSavedFilters() {
        const filterSetName = document.getElementById('filterSetName');
        if (filterSetName) {
            filterSetName.value = this.state.filterSetName;
        }
    }

    /**
     * Show load modal
     */
    showLoadModal() {
        const saved = JSON.parse(localStorage.getItem('objectFilterStudio_saved') || '[]');
        const modal = document.getElementById('loadModal');
        const listDiv = document.getElementById('savedFilters');

        if (saved.length === 0) {
            listDiv.innerHTML = '<div class="empty-state">Không có bộ lọc đã lưu</div>';
        } else {
            listDiv.innerHTML = saved.map(item => `
                <div class="saved-filter-item">
                    <div>
                        <div class="saved-filter-name">${this.escapeHtml(item.name)}</div>
                        <div class="saved-filter-date">${new Date(item.timestamp).toLocaleString('vi-VN')}</div>
                    </div>
                    <button class="saved-filter-btn" onclick="app.loadFilterSet('${item.name}')">Tải</button>
                </div>
            `).join('');
        }

        modal.style.display = 'flex';
    }

    /**
     * Close load modal
     */
    closeLoadModal() {
        document.getElementById('loadModal').style.display = 'none';
    }

    /**
     * Load a saved filter set
     */
    loadFilterSet(name) {
        const saved = JSON.parse(localStorage.getItem('objectFilterStudio_saved') || '[]');
        const filterSet = saved.find(s => s.name === name);

        if (filterSet) {
            this.state.filterSetName = filterSet.name;
            this.state.filters = JSON.parse(JSON.stringify(filterSet.config));
            this.state.isDirty = false;

            document.getElementById('filterSetName').value = this.state.filterSetName;
            this.filterEngine.clearFilters();
            this.state.filters.forEach(g => this.filterEngine.addFilterGroup(g));

            this.renderFilters();
            this.closeLoadModal();
            this.updateStatus(`Bộ lọc "${name}" đã được tải`);
        }
    }

    /**
     * Export filters to JSON file
     */
    exportFilters() {
        const exportData = {
            version: '2.0.0',
            name: this.state.filterSetName,
            timestamp: new Date().toISOString(),
            filters: this.state.filters
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `object-filters-${Date.now()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        this.updateStatus('Bộ lọc đã được xuất');
    }

    /**
     * Import filters from file
     */
    importFiltersFromFile(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);

                if (data.filters) {
                    this.state.filters = JSON.parse(JSON.stringify(data.filters));
                    this.state.filterSetName = data.name || this.state.filterSetName;

                    document.getElementById('filterSetName').value = this.state.filterSetName;
                    this.filterEngine.clearFilters();
                    this.state.filters.forEach(g => this.filterEngine.addFilterGroup(g));

                    this.renderFilters();
                    this.updateStatus('Bộ lọc đã được nhập thành công');
                } else {
                    this.updateStatus('Định dạng tệp không hợp lệ');
                }
            } catch (error) {
                this.updateStatus(`Lỗi khi nhập tệp: ${error.message}`);
            }
        };
        reader.readAsText(file);

        // Reset file input
        event.target.value = '';
    }

    /**
     * Update status message
     */
    updateStatus(message) {
        const statusEl = document.getElementById('statusMessage');
        if (statusEl) {
            statusEl.textContent = message;
        }
    }

    /**
     * Generate unique ID
     */
    generateId() {
        return 'id-' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Generate random color
     */
    generateRandomColor() {
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
            '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B88B', '#A8E6CF'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    /**
     * Escape HTML special characters
     */
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    /**
     * Mark state as dirty
     */
    markDirty() {
        this.state.isDirty = true;
    }
}

// Global variable for load modal function
function closeLoadModal() {
    if (app) app.closeLoadModal();
}

// Initialize application when DOM is ready
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new ObjectFilterStudio();
});

// Handle window closing if there are unsaved changes
window.addEventListener('beforeunload', (e) => {
    if (app && app.state.isDirty) {
        e.preventDefault();
        e.returnValue = '';
    }
});
