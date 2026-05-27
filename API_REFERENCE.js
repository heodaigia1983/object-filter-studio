// ============================================================================
// Object Filter Studio V2 - API Reference
// ============================================================================
//
// This file documents all public methods and usage patterns for extending
// the Object Filter Studio V2 extension.
//

// ============================================================================
// 1. FilterEngine Class (filter-engine.js)
// ============================================================================

/**
 * Core filtering and evaluation engine
 * 
 * Usage:
 *   const engine = new FilterEngine();
 *   engine.addFilterGroup({ color: '#FF0000', rows: [...] });
 *   engine.setObjects(allObjects);
 *   const matches = engine.evaluateAllObjects();
 */

class FilterEngine {
    // --- Public Methods ---
    
    /**
     * Add a filter group for evaluation
     * @param {Object} filterGroup - { id, color, rows: Array }
     */
    addFilterGroup(filterGroup) { }
    
    /**
     * Clear all filter groups
     */
    clearFilters() { }
    
    /**
     * Set objects to evaluate against filters
     * @param {Array<Object>} objects - Array of objects with properties
     */
    setObjects(objects) { }
    
    /**
     * Evaluate all objects against all filter groups
     * @returns {Array<{guid, color}>} Matched objects with colors
     */
    evaluateAllObjects() { }
    
    /**
     * Get statistics about current filters
     * @returns {Object} { matched: number, total: number, groups: number }
     */
    getStatistics() { }
    
    /**
     * Validate filter configuration
     * @param {Object} filterConfig - Full filter configuration
     * @returns {Object} { valid: boolean, errors: Array<string> }
     */
    validateFilterConfig(filterConfig) { }
    
    /**
     * Export filters to JSON format
     * @returns {Object} Exportable filter configuration
     */
    exportFilters() { }
    
    /**
     * Import and validate filter configuration
     * @param {Object} config - Filter configuration
     * @returns {Object} { success: boolean, error?: string }
     */
    importFilters(config) { }
    
    // --- Internal Methods (can be overridden) ---
    
    evaluateObjectAgainstGroup(object, filterGroup) { }
    evaluateRow(object, row) { }
    getPropertyValue(object, category, property) { }
}

// ============================================================================
// 2. IFCPropertiesManager Class (ifc-properties.js)
// ============================================================================

/**
 * Manages IFC property extraction and mapping
 * 
 * Usage:
 *   const manager = new IFCPropertiesManager();
 *   const props = manager.extractPropertiesFromIFC(ifcObject, guid);
 *   const conditions = manager.getConditionOptions();
 */

class IFCPropertiesManager {
    // --- Configuration ---
    
    propertyOptions = [
        'Prefix',
        'Assembly Mark',
        'Profile',
        'Material',
        'Phase',
        'Class',
        'Weight',
        'GUID'
    ];
    
    categoryOptions = ['Part', 'Assembly'];
    
    conditionOptions = [
        'Equals',
        'Does not equal',
        'Contains',
        'Does not contain',
        'Starts with',
        'Ends with'
    ];
    
    // --- Public Methods ---
    
    /**
     * Get available property names
     * @returns {Array<string>}
     */
    getPropertyOptions() { }
    
    /**
     * Get available categories
     * @returns {Array<string>}
     */
    getCategoryOptions() { }
    
    /**
     * Get available filter conditions
     * @returns {Array<string>}
     */
    getConditionOptions() { }
    
    /**
     * Extract properties from IFC object
     * @param {Object} ifcObject - Object from viewer API
     * @param {string} guid - Object GUID
     * @returns {Object} { guid, partProperties, assemblyProperties }
     */
    extractPropertiesFromIFC(ifcObject, guid) { }
    
    /**
     * Get nested property from object
     * @param {Object} obj - Object to query
     * @param {string} path - Property path ('Material.Name')
     * @returns {any} Property value
     */
    getProperty(obj, path) { }
    
    /**
     * Fetch objects from viewer
     * @param {Object} viewer - Viewer API reference
     * @returns {Promise<Array>} Objects with extracted properties
     */
    async getObjectsFromViewer(viewer) { }
    
    /**
     * Map raw properties to standard names
     * @param {Object} rawProperties - Properties from viewer
     * @returns {Object} Mapped properties
     */
    mapProperties(rawProperties) { }
    
    /**
     * Format value for display
     * @param {any} value - Value to format
     * @returns {string} Formatted value
     */
    formatValue(value) { }
    
    /**
     * Validate property name
     * @param {string} property - Property to validate
     * @returns {boolean}
     */
    isValidProperty(property) { }
    
    /**
     * Validate category name
     * @param {string} category - Category to validate
     * @returns {boolean}
     */
    isValidCategory(category) { }
    
    /**
     * Validate condition name
     * @param {string} condition - Condition to validate
     * @returns {boolean}
     */
    isValidCondition(condition) { }
    
    /**
     * Get property configuration metadata
     * @returns {Object} { properties, categories, conditions }
     */
    getPropertyMetadata() { }
}

// ============================================================================
// 3. ObjectFilterStudio Class (app.js)
// ============================================================================

/**
 * Main application controller
 * 
 * Usage:
 *   app = new ObjectFilterStudio();
 *   app.addFilterGroup();
 *   app.applyFilters();
 *   app.saveFilters();
 * 
 * Global reference: window.app
 */

class ObjectFilterStudio {
    // --- State ---
    
    state = {
        filters: [],              // Array of filter groups
        allObjects: [],           // All objects from viewer
        matchedObjects: [],       // Objects matching filters
        filterSetName: 'Default', // Current filter set name
        isDirty: false           // Whether changes have been saved
    };
    
    // --- Instances ---
    
    filterEngine;           // FilterEngine instance
    ifcPropertiesManager;   // IFCPropertiesManager instance
    viewer;                 // Trimble Connect Viewer reference
    
    // --- Public Methods ---
    
    // Filter Management
    
    /**
     * Add new filter group
     */
    addFilterGroup() { }
    
    /**
     * Delete filter group by ID
     * @param {string} groupId - Group ID to delete
     */
    deleteFilterGroup(groupId) { }
    
    /**
     * Add row to group
     * @param {string} groupId - Group ID
     */
    addRowToGroup(groupId) { }
    
    /**
     * Delete row from group
     * @param {string} groupId - Group ID
     * @param {string} rowId - Row ID
     */
    deleteRowFromGroup(groupId, rowId) { }
    
    /**
     * Update filter row value
     * @param {string} groupId - Group ID
     * @param {string} rowId - Row ID
     * @param {string} field - Field name (category, property, condition, value, operator)
     * @param {any} value - New value
     */
    updateRowValue(groupId, rowId, field, value) { }
    
    /**
     * Update group color
     * @param {string} groupId - Group ID
     * @param {string} color - Hex color code
     */
    updateGroupColor(groupId, color) { }
    
    // Viewer Operations
    
    /**
     * Apply configured filters to viewer
     * @returns {Promise<void>}
     */
    async applyFilters() { }
    
    /**
     * Reset all object colors in viewer
     * @returns {Promise<void>}
     */
    async resetColors() { }
    
    // Persistence
    
    /**
     * Save filters to localStorage
     */
    saveFilters() { }
    
    /**
     * Load filters from localStorage
     */
    loadSavedFilters() { }
    
    /**
     * Show load modal dialog
     */
    showLoadModal() { }
    
    /**
     * Load specific filter set
     * @param {string} name - Filter set name
     */
    loadFilterSet(name) { }
    
    /**
     * Export filters to JSON file
     */
    exportFilters() { }
    
    /**
     * Import filters from file
     * @param {Event} event - File input change event
     */
    importFiltersFromFile(event) { }
    
    // UI Updates
    
    /**
     * Render all filter groups
     */
    renderFilters() { }
    
    /**
     * Update status message
     * @param {string} message - Status message to display
     */
    updateStatus(message) { }
}

// ============================================================================
// 4. Data Structures
// ============================================================================

/**
 * Filter Group Structure
 */
interface FilterGroup {
    id: string;              // Unique identifier
    color: string;           // Hex color (#RRGGBB)
    rows: FilterRow[];       // Array of filter conditions
    label?: string;          // Optional label
}

/**
 * Filter Row Structure
 */
interface FilterRow {
    id: string;              // Unique identifier
    category: string;        // 'Part' or 'Assembly'
    property: string;        // Property name
    condition: string;       // Condition type
    value: string;           // Value to match
    operator?: string;       // 'AND' or 'OR' (for multi-row groups)
}

/**
 * IFC Object Structure (after extraction)
 */
interface ExtractedIFCObject {
    guid: string;
    partProperties: {
        Prefix: string;
        'Assembly Mark': string;
        Profile: string;
        Material: string;
        Phase: string;
        Class: string;
        Weight: string;
        GUID: string;
    };
    assemblyProperties: {
        // Same as partProperties
    };
}

/**
 * Filter Match Result
 */
interface FilterMatch {
    guid: string;            // Object GUID
    color: string;           // Hex color to apply
}

// ============================================================================
// 5. Usage Examples
// ============================================================================

// --- Example 1: Create and Apply Filters Programmatically ---

function exampleCreateFilters() {
    // Access global app instance
    if (!window.app) return;
    
    // Create first group - Steel parts
    app.addFilterGroup();
    let groupId = app.state.filters[0].id;
    app.updateGroupColor(groupId, '#FF0000');
    app.updateRowValue(groupId, app.state.filters[0].rows[0].id,
        'property', 'Material');
    app.updateRowValue(groupId, app.state.filters[0].rows[0].id,
        'condition', 'Equals');
    app.updateRowValue(groupId, app.state.filters[0].rows[0].id,
        'value', 'Steel');
    
    // Apply filters
    await app.applyFilters();
}

// --- Example 2: Access Filter Statistics ---

function exampleGetStatistics() {
    const stats = app.filterEngine.getStatistics();
    console.log(`Matched: ${stats.matched} / ${stats.total}`);
    console.log(`Filter groups: ${stats.groups}`);
}

// --- Example 3: Manual Filter Evaluation ---

function exampleManualEvaluation() {
    const engine = new FilterEngine();
    
    // Add filter group
    engine.addFilterGroup({
        id: 'group1',
        color: '#FF0000',
        rows: [{
            id: 'row1',
            category: 'Part',
            property: 'Material',
            condition: 'Equals',
            value: 'Steel'
        }]
    });
    
    // Set objects
    engine.setObjects([
        {
            guid: 'obj1',
            partProperties: { Material: 'Steel', ... }
        },
        {
            guid: 'obj2',
            partProperties: { Material: 'Concrete', ... }
        }
    ]);
    
    // Evaluate
    const matches = engine.evaluateAllObjects();
    console.log(matches); // [{ guid: 'obj1', color: '#FF0000' }]
}

// --- Example 4: Property Extraction ---

function examplePropertyExtraction() {
    const manager = new IFCPropertiesManager();
    
    const extracted = manager.extractPropertiesFromIFC({
        Tag: 'COL-01',
        ObjectType: 'HE200B',
        Material: { Name: 'Steel' },
        Weight: 42.5
    }, 'guid-123');
    
    console.log(extracted.partProperties.Material); // 'Steel'
}

// --- Example 5: Export and Import Filters ---

function exampleSaveAndLoad() {
    // Save filters
    app.saveFilters(); // Saves to localStorage
    
    // Export to file
    app.exportFilters(); // Downloads JSON
    
    // Import from file
    document.getElementById('fileInput').click();
    // Then importFiltersFromFile() is called
}

// --- Example 6: Add Custom Property ---

function exampleAddCustomProperty() {
    // Extend property options
    app.ifcPropertiesManager.propertyOptions.push('Custom Property');
    
    // Update extraction logic
    const originalExtract = app.ifcPropertiesManager.extractPropertiesFromIFC;
    app.ifcPropertiesManager.extractPropertiesFromIFC = function(obj, guid) {
        const result = originalExtract.call(this, obj, guid);
        result.partProperties['Custom Property'] = obj.customProp || '';
        return result;
    };
    
    // Re-render to show new option
    app.renderFilters();
}

// ============================================================================
// 6. Extension Points
// ============================================================================

// --- Custom Condition Handler ---

// In filter-engine.js, modify evaluateRow():
case 'My Custom Condition':
    return this.evaluateCustomCondition(objectValue, filterValue);

evaluateCustomCondition(objectValue, filterValue) {
    // Your logic here
    return true;
}

// --- Custom Viewer Integration ---

// In app.js, modify setupViewer():
setupViewer() {
    if (window.myCustomViewerAPI) {
        this.viewer = window.myCustomViewerAPI;
    }
}

// Then implement custom colorization:
async colorizeObjects(matchedObjects) {
    for (const { guid, color } of matchedObjects) {
        if (window.myCustomAPI?.colorObject) {
            await window.myCustomAPI.colorObject(guid, color);
        }
    }
}

// --- Custom Property Extraction ---

// In ifc-properties.js, override extractPropertiesFromIFC():
extractPropertiesFromIFC(ifcObject, guid) {
    const result = super.extractPropertiesFromIFC(ifcObject, guid);
    
    // Add custom properties
    result.partProperties['MyProp'] = ifcObject.myProperty;
    
    return result;
}

// ============================================================================
// 7. Debugging Guide
// ============================================================================

// --- Enable Debug Logging ---

// Add to app.js constructor:
this.DEBUG = true;

// Then use throughout:
if (this.DEBUG) console.log('Debug info:', data);

// --- Inspect State ---

// In browser console:
console.log(app.state);              // View entire state
console.log(app.state.filters);      // View filter configuration
console.log(app.state.allObjects);   // View all objects
console.log(app.state.matchedObjects); // View matched objects

// --- Test Filter Engine Independently ---

const engine = new FilterEngine();
// ... configure filters ...
const matches = engine.evaluateAllObjects();
console.log(matches);

// --- Check Storage ---

localStorage.getItem('objectFilterStudio_saved');

// --- Validate Configuration ---

const validation = app.filterEngine.validateFilterConfig(app.state.filters);
console.log(validation.errors);

// ============================================================================
// 8. Performance Optimization
// ============================================================================

// --- Cache Objects ---
// Objects are cached in app.state.allObjects after first load

// --- Optimize Conditions ---
// Use restrictive conditions first (Equals > Contains)
// Use AND before OR when possible

// --- Batch Updates ---
// Apply multiple filters in one call rather than separately

// --- Lazy Loading ---
// Load objects only when needed:
if (app.state.allObjects.length === 0) {
    app.state.allObjects = await app.ifcPropertiesManager
        .getObjectsFromViewer(app.viewer);
}

// ============================================================================
// End of API Reference
// ============================================================================
