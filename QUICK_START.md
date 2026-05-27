# Quick Start Guide - Object Filter Studio V2

## 📋 Pre-requisites

- Trimble Connect Environment
- Modern web browser (Chrome, Edge, Firefox, Safari)
- Basic understanding of IFC/BIM concepts

## 🚀 Deployment

### Step 1: Verify File Structure

Ensure all files are in place:

```
object-filter-studio/
├── manifest.json
├── index.html
├── style.css
├── app.js
├── filter-engine.js
├── ifc-properties.js
├── README.md
└── QUICK_START.md (this file)
```

### Step 2: Integration with Trimble Connect

**Option A: Extension Folder Deployment**

1. Navigate to Trimble Connect extensions directory
2. Create folder: `object-filter-studio`
3. Copy all files into this folder
4. Restart Trimble Connect

**Option B: Web Embedding**

If embedding in a web application:

```html
<!-- In your host HTML -->
<div id="filter-studio-container"></div>

<script>
    // Load extension files
    fetch('object-filter-studio/index.html')
        .then(r => r.text())
        .then(html => {
            document.getElementById('filter-studio-container').innerHTML = html;
            // Extension will auto-initialize
        });
</script>
```

**Option C: Iframe Integration**

```html
<iframe 
    src="object-filter-studio/index.html"
    style="width:100%; height:100%; border:none;">
</iframe>
```

### Step 3: Configure Viewer API

Edit `app.js` to match your Trimble Connect environment:

```javascript
// Around line 50 in app.js
setupViewer() {
    // Adjust to your API structure
    if (window.trimbleConnect?.viewer) {
        this.viewer = window.trimbleConnect.viewer;
    } else if (window.YourViewerAPI) {
        this.viewer = window.YourViewerAPI;
    }
}
```

## 📖 Basic Usage (5 minutes)

### Create Your First Filter

1. **Open the extension**
   - Look for "Object Filter Studio V2" in the panel

2. **Add a filter group**
   - Click "+ Thêm nhóm lọc" (Add Filter Group)
   - A new group with default color appears

3. **Configure the filter**
   - **Category**: Select "Part" (for parts)
   - **Property**: Select "Material"
   - **Condition**: Select "Equals"
   - **Value**: Type "Steel"

4. **Apply the filter**
   - Click "Áp dụng bộ lọc" (Apply Filter)
   - All steel parts become colored
   - Other parts fade to gray

5. **Save your work**
   - Enter a name in "Tên bộ lọc" field
   - Click "💾 Lưu" (Save)

## 🎯 Common Filter Scenarios

### Scenario 1: Find all concrete elements

1. Add Group → Default color
2. Set filter: Category = Part, Property = Material, Condition = Equals, Value = Concrete
3. Click Apply

### Scenario 2: Find structural and non-structural

**Group 1** (Red color):
- Property = Class, Equals, Structural

**Group 2** (Blue color):
- Property = Class, Equals, Non-Structural

### Scenario 3: Find items with missing properties

- Property = Material, Equals, (leave empty)
- Click Apply to find items without material assigned

### Scenario 4: Complex filter (AND/OR logic)

**Group 1** (Green):
- Row 1: Material Contains "Steel" **AND**
- Row 2: Profile Starts with "HE" **AND**
- Row 3: Class Equals "Primary"

Creates a group for all steel HE-sections that are primary

## 💾 Save & Load Filters

### Save to Browser

```
1. Configure your filters
2. Enter name: "My Filter Set"
3. Click "💾 Lưu"
4. Filter saved locally (survives page refresh)
```

### Load Saved Filter

```
1. Click "📂 Tải" (Load)
2. Modal shows all saved filters with dates
3. Click "Tải" next to filter name
4. Filters load into editor
```

### Export to File

```
1. Click "📥 Xuất" (Export)
2. File "object-filters-TIMESTAMP.json" downloads
3. Share file with team
```

### Import from File

```
1. Click "📤 Nhập" (Import)
2. Select .json file from your computer
3. Filters load and replace current ones
4. Click "Áp dụng bộ lọc" to apply
```

## 🎨 Customization

### Change Colors

1. Click the **color box** in any group header
2. Select new color
3. Changes apply immediately

### Pre-set Colors

The extension includes these preset colors:
- Red (#FF6B6B)
- Teal (#4ECDC4)
- Light Blue (#45B7D1)
- Salmon (#FFA07A)
- Mint (#98D8C8)
- Yellow (#F7DC6F)
- Purple (#BB8FCE)
- Sky Blue (#85C1E2)

### Translate to English

**Manual translation** - Replace Vietnamese in UI:

| Vietnamese | English |
|-----------|---------|
| Thêm nhóm lọc | Add Filter Group |
| Đặt lại | Reset |
| Áp dụng bộ lọc | Apply Filter |
| 💾 Lưu | Save |
| 📂 Tải | Load |
| 📥 Xuất | Export |
| 📤 Nhập | Import |
| Tên bộ lọc | Filter Set Name |
| Phạm vi | Category |
| Thuộc tính | Property |
| Điều kiện | Condition |
| Giá trị | Value |

Search `index.html` and `app.js` for these strings and replace them.

## 🔧 Troubleshooting Checklist

### ❌ Extension doesn't load

- [ ] All 6 files present in folder
- [ ] manifest.json is valid JSON
- [ ] Check browser console (F12) for errors
- [ ] Verify Trimble Connect is running
- [ ] Try hard refresh (Ctrl+Shift+R)

### ❌ Objects aren't colorizing

- [ ] Check viewer is accessible: `console.log(window.viewer)`
- [ ] Verify object GUIDs exist: Apply filter with verbose logging
- [ ] Check if viewer API method names match (setObjectColor vs colorObject)
- [ ] Test with simple "Equals" condition first

### ❌ Saved filters won't load

- [ ] Check localStorage isn't full: `console.log(localStorage.length)`
- [ ] Clear cache: `localStorage.removeItem('objectFilterStudio_saved')`
- [ ] Try exporting/importing .json instead
- [ ] Check browser storage privacy settings

### ❌ Performance is slow

- [ ] Reduce number of objects evaluated
- [ ] Use more specific conditions
- [ ] Reduce opacity update calls
- [ ] Test with smaller model first

## 📝 Developer Notes

### Class Architecture

```
app.js
├── ObjectFilterStudio (main controller)
├── Uses FilterEngine (evaluation)
├── Uses IFCPropertiesManager (mapping)
└── Manages DOM & localStorage

filter-engine.js
├── FilterEngine class
├── evaluateObjectAgainstGroup()
├── evaluateRow()
└── evaluateAllObjects()

ifc-properties.js
├── IFCPropertiesManager class
├── extractPropertiesFromIFC()
├── getPropertyOptions()
└── validateProperty()
```

### Debugging Tips

Enable debug logging:

```javascript
// Add to app.js
applyFilters() {
    console.log('Current filters:', this.state.filters);
    console.log('Objects count:', this.state.allObjects.length);
    console.log('Matched:', this.state.matchedObjects);
}
```

### API Adaptation

If Trimble Connect API differs, modify these methods:

```javascript
// In app.js - Line 350
async colorizeObjects(matchedObjects) {
    // Adapt setObjectColor call here
}

// In ifc-properties.js - Line 120
extractPropertiesFromIFC(ifcObject, guid) {
    // Adapt property extraction here
}
```

## ✅ Verification Checklist

After deployment, verify:

- [ ] Extension loads without errors
- [ ] UI appears correctly (dark theme, Vietnamese text)
- [ ] Can create filter groups
- [ ] Can add/delete rows
- [ ] Can change colors
- [ ] Can apply filters (objects get colored)
- [ ] Status message shows match count
- [ ] Save/Load works
- [ ] Export/Import works
- [ ] Reset button restores original colors

## 📞 Support Resources

1. **Console Logs** - Press F12, check console tab
2. **Status Messages** - Watch bottom status bar during operations
3. **README.md** - Full feature documentation
4. **Code Comments** - Inline documentation in all .js files

## 🎓 Next Steps

1. **Test with your model** - Try with actual IFC data
2. **Customize properties** - Edit property list for your use case
3. **Translate UI** - Change Vietnamese to your language
4. **Integrate with team** - Export/share filter sets
5. **Extend features** - Add custom conditions or properties

---

**Ready to use!** 🚀

Start by creating your first filter group and applying it to your model.

For detailed documentation, see **README.md**
