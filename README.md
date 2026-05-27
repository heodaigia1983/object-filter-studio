# Object Filter Studio V2

**Advanced IFC object filtering and colorization for Trimble Connect**

## Overview

Object Filter Studio V2 is a Trimble Connect Extension that enables users to:
- Create multiple filter groups with custom colors
- Define complex filtering rules using categories, properties, conditions, and values
- Apply AND/OR logic to combine multiple conditions
- Colorize matched IFC objects in the viewer
- Save, load, export, and import filter configurations
- Highlight unmatched objects with reduced opacity

## File Structure

```
object-filter-studio/
├── manifest.json           # Trimble Connect extension manifest
├── index.html              # Main UI structure
├── style.css               # Dark mode + glassmorphism styling
├── app.js                  # Main application logic (1100+ lines)
├── filter-engine.js        # Filter evaluation engine
├── ifc-properties.js       # IFC property mapping
└── README.md              # This file
```

## Features

### Core Functionality

✅ **Multiple Filter Groups**
- Each group has a unique color
- Groups can contain multiple filter rows
- First matching group's color is applied to objects

✅ **Flexible Filtering**
- Category: Part, Assembly
- Properties: Prefix, Assembly Mark, Profile, Material, Phase, Class, Weight, GUID
- Conditions: Equals, Does not equal, Contains, Does not contain, Starts with, Ends with
- AND/OR logic between conditions

✅ **Visual Feedback**
- Color-code matched objects
- Gray out (0.2 opacity) unmatched objects
- Real-time statistics (X matched / Y total)
- Status messages for all operations

✅ **Persistence**
- Save filter sets to localStorage
- Export to .json files
- Import from .json files
- Filter naming and timestamps

✅ **UI/UX**
- Dark mode with glassmorphism effects
- Vietnamese labels (can be customized)
- Responsive layout
- Smooth animations and transitions
- Real-time form validation

## Installation

### Option 1: Direct File Copy
1. Copy the entire `object-filter-studio` folder to your Trimble Connect Extensions directory
2. The extension will be auto-loaded when Trimble Connect starts

### Option 2: Manual Integration
1. Create a new folder in your project for this extension
2. Copy all files from this folder
3. Modify `manifest.json` if needed for your environment

## Usage

### Creating a Filter

1. **Add a Group** - Click "+ Thêm nhóm lọc" button
2. **Set Color** - Click the color box to select a group color
3. **Add Conditions** - Define filter rows:
   - Select **Category** (Part or Assembly)
   - Select **Property** (e.g., Material, Profile)
   - Choose **Condition** (e.g., Equals, Contains)
   - Enter **Value** to match
4. **Add Multiple Rows** - Click "+ Thêm điều kiện" in a group
5. **Set Logic** - Use AND/OR between rows

### Applying Filters

1. Configure your filter groups
2. Click **"Áp dụng bộ lọc"** to apply
3. Matched objects are colorized
4. Unmatched objects become semi-transparent

### Managing Filters

- **Save** - Store current filter in browser (localStorage)
- **Load** - Retrieve saved filters
- **Export** - Download as .json file
- **Import** - Upload from .json file
- **Reset** - Restore original object colors

## API Integration

### Trimble Connect Viewer API

The extension expects access to the Trimble Connect viewer with these methods:

```javascript
// Get object properties
viewer.getObjectProperties(guid)

// Set object color (hex format)
viewer.setObjectColor(guid, '#0088FF')

// Set object opacity
viewer.setObjectOpacity(guid, 0.2)

// Reset all colors
viewer.resetObjectColors()

// Get visible objects (custom implementation)
viewer.getVisibleObjects()
```

**Note**: Adapt the API calls in `app.js` and `ifc-properties.js` based on your actual Trimble Connect environment.

## Configuration

### Customize Vietnamese Labels

Edit the Vietnamese strings in `index.html`, `style.css`, and `app.js`:

```javascript
// Example: Replace Vietnamese text
// 'Thêm nhóm lọc' → 'Add Filter Group'
// 'Đặt lại' → 'Reset'
// 'Phạm vi' → 'Category'
```

### Adjust Colors and Styling

Edit `:root` variables in `style.css`:

```css
:root {
    --primary-color: #0088FF;        /* Main blue */
    --success-color: #10b981;        /* Apply button */
    --danger-color: #ef4444;         /* Delete button */
    /* ... other variables ... */
}
```

### Modify Property Mappings

Edit the property list in `ifc-properties.js`:

```javascript
this.propertyOptions = [
    'Prefix',
    'Assembly Mark',
    'Profile',
    'Material',
    // Add more properties
];
```

## Data Storage

### localStorage

Saved filter sets are stored in browser localStorage:
```javascript
objectFilterStudio_saved = [
    {
        name: "Filter Set Name",
        timestamp: "2026-05-27T10:30:00Z",
        config: [/* filter groups */]
    }
]
```

### Export Format

Exported .json files contain:
```json
{
    "version": "2.0.0",
    "name": "Filter Set Name",
    "timestamp": "2026-05-27T10:30:00Z",
    "filters": [
        {
            "id": "id-abc123",
            "color": "#0088FF",
            "rows": [
                {
                    "id": "id-xyz789",
                    "category": "Part",
                    "property": "Material",
                    "condition": "Equals",
                    "value": "Steel",
                    "operator": "AND"
                }
            ]
        }
    ]
}
```

## Object Properties Mapping

The extension maps IFC attributes to filterable properties:

| Property | IFC Source | Default |
|----------|-----------|---------|
| GUID | GlobalId | Object ID |
| Prefix | Tag | From object metadata |
| Assembly Mark | Mark | From object metadata |
| Profile | ObjectType | From object metadata |
| Material | Material.Name | Material property |
| Phase | Phase | Phase property |
| Class | Class | Class property |
| Weight | Weight | Weight property |

Customize mappings in `ifc-properties.js` method `extractPropertiesFromIFC()`.

## Troubleshooting

### Objects Not Colorizing

1. **Check Viewer Access**
   ```javascript
   console.log(window.trimbleConnect?.viewer);
   console.log(window.viewer);
   ```

2. **Verify API Methods**
   - Ensure `setObjectColor()` is available
   - Check if GUID format matches viewer expectations

3. **Enable Console Logging**
   - Open DevTools (F12)
   - Check for error messages
   - Review the "Kiểm soát" panel status

### Filters Not Matching

1. **Verify Property Values**
   - Check actual object properties in viewer
   - Ensure case sensitivity is handled correctly
   - Confirm property names match IFC metadata

2. **Test Filter Logic**
   - Start with simple "Equals" conditions
   - Gradually add complex AND/OR logic

### Save/Load Issues

1. **Clear Storage**
   ```javascript
   localStorage.removeItem('objectFilterStudio_saved');
   ```

2. **Check Browser Storage**
   - Verify localStorage is enabled
   - Check available storage quota

## Performance Optimization

For large models (10,000+ objects):

1. **Filter Before Applying**
   - Use restrictive conditions
   - Limit the number of groups

2. **Batch Color Updates**
   - Consider implementing pagination
   - Update in chunks if API supports it

3. **Cache Objects**
   - The extension caches object list
   - Refresh manually if needed

## Extending the Extension

### Add New Property

1. Update `ifc-properties.js`:
   ```javascript
   this.propertyOptions.push('New Property');
   ```

2. Update mapping in `extractPropertiesFromIFC()`:
   ```javascript
   'New Property': this.getProperty(ifcObject, 'NewIfcAttribute')
   ```

### Add New Condition

1. Update `ifc-properties.js`:
   ```javascript
   this.conditionOptions.push('Custom Condition');
   ```

2. Update logic in `filter-engine.js`:
   ```javascript
   case 'Custom Condition':
       return this.evaluateCustomCondition(objectValue, filterValue);
   ```

### Localization

Replace Vietnamese text globally with your language:
```bash
# Replace all Vietnamese phrases
# E.g., 'Đặt lại' → 'Reset'
# 'Thêm' → 'Add'
# etc.
```

## Browser Compatibility

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Modern browsers with ES6 support

## License

MIT License - Feel free to modify and extend

## Support

For issues or feature requests:
1. Check the Troubleshooting section
2. Review console errors (F12)
3. Verify Trimble Connect API version compatibility
4. Test with sample filter configurations

---

**Version**: 2.0.0  
**Created**: May 2026  
**Compatible with**: Trimble Connect Viewer 1.0.0+
