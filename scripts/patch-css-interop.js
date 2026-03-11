/**
 * Patches react-native-css-interop to prevent crashes with React Navigation v7.
 * The `stringify` function in render-component.js calls Object.entries() on props,
 * which triggers React Navigation v7's NavigationStateContext getter that throws
 * "Couldn't find a navigation context" when accessed outside a NavigationContainer.
 * This patch wraps the enumeration in a try-catch.
 */
const fs = require('fs');
const path = require('path');

const filePath = path.join(
  __dirname,
  '..',
  'node_modules',
  'react-native-css-interop',
  'dist',
  'runtime',
  'native',
  'render-component.js'
);

if (!fs.existsSync(filePath)) {
  console.log('patch-css-interop: file not found, skipping');
  process.exit(0);
}

let content = fs.readFileSync(filePath, 'utf8');

// Only patch if not already patched
if (content.includes('[Unserializable]')) {
  console.log('patch-css-interop: already patched, skipping');
  process.exit(0);
}

const original = `function stringify(object) {
    const seen = new WeakSet();
    return JSON.stringify(object, function replace(_, value) {
        if (!(value !== null && typeof value === "object")) {
            return value;
        }
        if (seen.has(value)) {
            return "[Circular]";
        }
        seen.add(value);
        const newValue = Array.isArray(value) ? [] : {};
        for (const entry of Object.entries(value)) {
            newValue[entry[0]] = replace(entry[0], entry[1]);
        }
        seen.delete(value);
        return newValue;
    }, 2);
}`;

const patched = `function stringify(object) {
    try {
    const seen = new WeakSet();
    return JSON.stringify(object, function replace(_, value) {
        if (!(value !== null && typeof value === "object")) {
            return value;
        }
        if (seen.has(value)) {
            return "[Circular]";
        }
        seen.add(value);
        const newValue = Array.isArray(value) ? [] : {};
        try {
        for (const entry of Object.entries(value)) {
            newValue[entry[0]] = replace(entry[0], entry[1]);
        }
        } catch (e) {
            return "[Unserializable]";
        }
        seen.delete(value);
        return newValue;
    }, 2);
    } catch (e) {
        return "[Unserializable]";
    }
}`;

if (content.includes(original)) {
  content = content.replace(original, patched);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('patch-css-interop: patched successfully');
} else {
  console.log('patch-css-interop: target code not found (may be a different version), skipping');
}
