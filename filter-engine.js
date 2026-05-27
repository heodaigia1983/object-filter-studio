/**
 * Filter Engine for Object Filter Studio V2
 * Handles filter evaluation and object matching logic
 */

class FilterEngine {
    constructor() {
        this.filters = [];
        this.allObjects = [];
    }

    /**
     * Add a filter group
     * @param {Object} filterGroup - Filter group configuration
     */
    addFilterGroup(filterGroup) {
        this.filters.push(filterGroup);
    }

    /**
     * Clear all filters
     */
    clearFilters() {
        this.filters = [];
    }

    /**
     * Set all IFC objects to evaluate against
     * @param {Array} objects - Array of IFC objects with properties
     */
    setObjects(objects) {
        this.allObjects = objects || [];
    }

    /**
     * Evaluate a single object against a filter group
     * @param {Object} object - IFC object to evaluate
     * @param {Object} filterGroup - Filter group with rows
     * @returns {boolean} - Whether object matches the filter group
     */
    evaluateObjectAgainstGroup(object, filterGroup) {
        if (!filterGroup.rows || filterGroup.rows.length === 0) {
            return false;
        }

        const results = filterGroup.rows.map(row => this.evaluateRow(object, row));

        // Evaluate with AND/OR logic
        if (filterGroup.rows.length === 1) {
            return results[0];
        }

        let currentResult = results[0];
        for (let i = 1; i < filterGroup.rows.length; i++) {
            const operator = filterGroup.rows[i - 1].operator || 'AND';
            if (operator === 'AND') {
                currentResult = currentResult && results[i];
            } else if (operator === 'OR') {
                currentResult = currentResult || results[i];
            }
        }

        return currentResult;
    }

    /**
     * Evaluate a single row condition
     * @param {Object} object - IFC object
     * @param {Object} row - Filter row with category, property, condition, value
     * @returns {boolean}
     */
    evaluateRow(object, row) {
        const { category, property, condition, value } = row;

        // Get the property value from object
        let objectValue = this.getPropertyValue(object, category, property);

        if (objectValue === null || objectValue === undefined) {
            return false;
        }

        // Convert to string for comparison
        objectValue = String(objectValue).toLowerCase().trim();
        const filterValue = String(value).toLowerCase().trim();

        // Apply condition
        switch (condition) {
            case 'Equals':
                return objectValue === filterValue;
            case 'Does not equal':
                return objectValue !== filterValue;
            case 'Contains':
                return objectValue.includes(filterValue);
            case 'Does not contain':
                return !objectValue.includes(filterValue);
            case 'Starts with':
                return objectValue.startsWith(filterValue);
            case 'Ends with':
                return objectValue.endsWith(filterValue);
            default:
                return false;
        }
    }

    /**
     * Get property value from IFC object
     * @param {Object} object - IFC object
     * @param {string} category - Part or Assembly
     * @param {string} property - Property name
     * @returns {*} - Property value
     */
    getPropertyValue(object, category, property) {
        // Properties are mapped in the object based on category
        if (category === 'Part') {
            return object.partProperties?.[property] || null;
        } else if (category === 'Assembly') {
            return object.assemblyProperties?.[property] || null;
        }
        return null;
    }

    /**
     * Evaluate all objects against all filter groups
     * @returns {Array} - Array of { guid, color } for matched objects
     */
    evaluateAllObjects() {
        const results = [];
        const matchedObjects = new Set();

        // Evaluate each filter group (in order - first match wins)
        for (const filterGroup of this.filters) {
            for (const object of this.allObjects) {
                // Skip if already matched by a previous group
                if (matchedObjects.has(object.guid)) {
                    continue;
                }

                // Check if object matches this group
                if (this.evaluateObjectAgainstGroup(object, filterGroup)) {
                    results.push({
                        guid: object.guid,
                        color: filterGroup.color
                    });
                    matchedObjects.add(object.guid);
                }
            }
        }

        return results;
    }

    /**
     * Get statistics about filter matches
     * @returns {Object} - Statistics { matched, total, groups }
     */
    getStatistics() {
        const matched = this.evaluateAllObjects().length;
        return {
            matched,
            total: this.allObjects.length,
            groups: this.filters.length
        };
    }

    /**
     * Validate filter configuration
     * @param {Object} filterConfig - Complete filter configuration
     * @returns {Object} - { valid: boolean, errors: Array }
     */
    validateFilterConfig(filterConfig) {
        const errors = [];

        if (!filterConfig.groups || !Array.isArray(filterConfig.groups)) {
            errors.push('Filter groups must be an array');
        }

        filterConfig.groups?.forEach((group, idx) => {
            if (!group.color || !/^#[0-9A-Fa-f]{6}$/.test(group.color)) {
                errors.push(`Group ${idx + 1}: Invalid color format`);
            }
            if (!group.rows || group.rows.length === 0) {
                errors.push(`Group ${idx + 1}: Must have at least one filter row`);
            }

            group.rows?.forEach((row, ridx) => {
                if (!row.category || !['Part', 'Assembly'].includes(row.category)) {
                    errors.push(`Group ${idx + 1}, Row ${ridx + 1}: Invalid category`);
                }
                if (!row.property) {
                    errors.push(`Group ${idx + 1}, Row ${ridx + 1}: Property is required`);
                }
                if (!row.condition) {
                    errors.push(`Group ${idx + 1}, Row ${ridx + 1}: Condition is required`);
                }
            });
        });

        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Export filter configuration to JSON
     * @returns {Object} - Filter configuration
     */
    exportFilters() {
        return {
            version: '2.0.0',
            timestamp: new Date().toISOString(),
            groups: this.filters
        };
    }

    /**
     * Import filter configuration from JSON
     * @param {Object} config - Filter configuration
     * @returns {Object} - { success: boolean, error?: string }
     */
    importFilters(config) {
        const validation = this.validateFilterConfig(config);
        if (!validation.valid) {
            return {
                success: false,
                error: `Invalid filter configuration: ${validation.errors.join('; ')}`
            };
        }

        this.clearFilters();
        config.groups.forEach(group => this.addFilterGroup(group));

        return { success: true };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FilterEngine;
}
