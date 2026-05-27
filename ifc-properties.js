/**
 * IFC Properties Manager for Object Filter Studio V2
 * Maps IFC attributes to filterable properties
 */

class IFCPropertiesManager {
    constructor() {
        this.propertyOptions = [
            'Prefix',
            'Assembly Mark',
            'Profile',
            'Material',
            'Phase',
            'Class',
            'Weight',
            'GUID'
        ];

        this.categoryOptions = [
            'Part',
            'Assembly'
        ];

        this.conditionOptions = [
            'Equals',
            'Does not equal',
            'Contains',
            'Does not contain',
            'Starts with',
            'Ends with'
        ];
    }

    /**
     * Get available property options
     * @returns {Array} - List of property names
     */
    getPropertyOptions() {
        return [...this.propertyOptions];
    }

    /**
     * Get available category options
     * @returns {Array} - List of categories
     */
    getCategoryOptions() {
        return [...this.categoryOptions];
    }

    /**
     * Get available condition options
     * @returns {Array} - List of conditions
     */
    getConditionOptions() {
        return [...this.conditionOptions];
    }

    /**
     * Extract properties from IFC object using Trimble Connect API
     * @param {Object} ifcObject - IFC object from viewer API
     * @param {string} guid - Object GUID
     * @returns {Object} - Extracted properties { guid, partProperties, assemblyProperties }
     */
    extractPropertiesFromIFC(ifcObject, guid) {
        const properties = {
            guid,
            partProperties: {},
            assemblyProperties: {}
        };

        if (!ifcObject) {
            return properties;
        }

        // Extract Part properties
        properties.partProperties = {
            Prefix: this.getProperty(ifcObject, 'Tag') || '',
            'Assembly Mark': this.getProperty(ifcObject, 'Mark') || '',
            Profile: this.getProperty(ifcObject, 'ObjectType') || '',
            Material: this.getProperty(ifcObject, 'Material') || '',
            Phase: this.getProperty(ifcObject, 'Phase') || '',
            Class: this.getProperty(ifcObject, 'Class') || '',
            Weight: this.getProperty(ifcObject, 'Weight') || '',
            GUID: guid
        };

        // Extract Assembly properties
        properties.assemblyProperties = {
            Prefix: this.getProperty(ifcObject, 'Tag') || '',
            'Assembly Mark': this.getProperty(ifcObject, 'Mark') || '',
            Profile: this.getProperty(ifcObject, 'ObjectType') || '',
            Material: this.getProperty(ifcObject, 'Material') || '',
            Phase: this.getProperty(ifcObject, 'Phase') || '',
            Class: this.getProperty(ifcObject, 'Class') || '',
            Weight: this.getProperty(ifcObject, 'Weight') || '',
            GUID: guid
        };

        return properties;
    }

    /**
     * Get nested property value safely
     * @param {Object} obj - Object to query
     * @param {string} path - Property path (e.g., 'Material.Name')
     * @returns {*} - Property value or null
     */
    getProperty(obj, path) {
        if (!obj || !path) return null;

        const keys = path.split('.');
        let current = obj;

        for (const key of keys) {
            if (current == null) return null;
            current = current[key];
        }

        return current;
    }

    /**
     * Get objects from Trimble Connect Viewer
     * @param {Object} viewer - Trimble Connect viewer instance
     * @returns {Promise<Array>} - Array of objects with properties
     */
    async getObjectsFromViewer(viewer) {
        if (!viewer) {
            console.warn('Viewer not available');
            return [];
        }

        const objects = [];

        try {
            // Get all visible objects from viewer
            // This is a placeholder - adapt to actual Trimble Connect API
            if (typeof viewer.getVisibleObjects === 'function') {
                const visibleObjects = await viewer.getVisibleObjects();

                for (const obj of visibleObjects) {
                    const guid = obj.guid || obj.id || obj.GlobalId;
                    const properties = this.extractPropertiesFromIFC(obj, guid);
                    objects.push(properties);
                }
            }
        } catch (error) {
            console.error('Error fetching objects from viewer:', error);
        }

        return objects;
    }

    /**
     * Map raw IFC properties to standard format
     * @param {Object} rawProperties - Raw IFC properties
     * @returns {Object} - Mapped properties
     */
    mapProperties(rawProperties) {
        if (!rawProperties) return {};

        const mapped = {};

        // Map common IFC properties to our standard names
        const propertyMap = {
            'Tag': 'Prefix',
            'Mark': 'Assembly Mark',
            'ObjectType': 'Profile',
            'Material': 'Material',
            'Phase': 'Phase',
            'Class': 'Class',
            'Weight': 'Weight',
            'GlobalId': 'GUID',
            'Pset_ProfileProperties': 'Profile'
        };

        for (const [ifcName, standardName] of Object.entries(propertyMap)) {
            if (rawProperties.hasOwnProperty(ifcName)) {
                mapped[standardName] = rawProperties[ifcName];
            }
        }

        return mapped;
    }

    /**
     * Format value for display
     * @param {*} value - Value to format
     * @returns {string} - Formatted value
     */
    formatValue(value) {
        if (value === null || value === undefined) {
            return '';
        }

        if (typeof value === 'object') {
            if (value.Name) return value.Name;
            if (value.value) return String(value.value);
            return JSON.stringify(value);
        }

        return String(value);
    }

    /**
     * Validate property name
     * @param {string} property - Property name
     * @returns {boolean}
     */
    isValidProperty(property) {
        return this.propertyOptions.includes(property);
    }

    /**
     * Validate category name
     * @param {string} category - Category name
     * @returns {boolean}
     */
    isValidCategory(category) {
        return this.categoryOptions.includes(category);
    }

    /**
     * Validate condition name
     * @param {string} condition - Condition name
     * @returns {boolean}
     */
    isValidCondition(condition) {
        return this.conditionOptions.includes(condition);
    }

    /**
     * Get property metadata
     * @returns {Object} - Property configuration
     */
    getPropertyMetadata() {
        return {
            properties: this.propertyOptions,
            categories: this.categoryOptions,
            conditions: this.conditionOptions
        };
    }

    /**
     * Test property value against sample data
     * @param {Object} sampleObject - Sample object to test
     * @returns {Object} - Test result { success, samples }
     */
    testPropertyExtraction(sampleObject) {
        try {
            const extracted = this.extractPropertiesFromIFC(sampleObject, 'test-guid');
            return {
                success: true,
                samples: extracted
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IFCPropertiesManager;
}
