module.exports = {
  env: 'jutranjik',
  build: {
    templates: {
      source: 'src/maizzle/templates',
    },
    tailwind: {
      css: 'src/maizzle/assets/css/main.css',
      config: 'tailwind.config.js',
    },
  },
  inlineCSS: {
    enabled: true,
    styleToAttribute: {
      'background-color': 'bgcolor',
      'background-image': 'background',
      'text-align': 'align',
      'vertical-align': 'valign',
    },
    applyWidthAttributes: ['IMG'],
    applyHeightAttributes: ['IMG'],
  },
  extraAttributes: {
    table: {
      border: 0,
      cellpadding: 0,
      cellspacing: 0,
      role: 'presentation',
    },
  },
  purgeCSS: {
    safelist: ['moz-text-html'],
  },
  prettify: {
    enabled: true,
  },
  removeUnusedCSS: {
    enabled: true,
    whitelist: ['.moz-text-html*'],
  },
};
