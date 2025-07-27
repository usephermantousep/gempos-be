import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export class SwaggerConfig {
  static setup(app: INestApplication): void {
    const config = new DocumentBuilder()
      .setTitle('GemPOS API')
      .setDescription('Multi-tenant Point of Sales API for UMKM Indonesia')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document, {
      customSiteTitle: 'GemPOS API Documentation',
      customfavIcon: '/favicon.ico',
      customJs: [
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
      ],
      customCssUrl: [
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
      ],
      customCss: this.getCustomCSS(),
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        docExpansion: 'none',
        filter: true,
        showRequestHeaders: true,
        tryItOutEnabled: true,
      },
      customJsStr: this.getCustomJS(),
    });
  }

  private static getCustomCSS(): string {
    return `
      .swagger-ui .topbar { display: none; }
      .swagger-ui .info { margin: 20px 0; }
      .swagger-ui .info .title { color: #3b4151; }
      
      /* Light Mode Default Styles */
      body:not(.dark-mode) {
        background-color: #ffffff !important;
        color: #3b4151 !important;
      }
      
      body:not(.dark-mode) .swagger-ui {
        background: #ffffff !important;
        color: #3b4151 !important;
      }
      
      body:not(.dark-mode) .swagger-ui .info .title {
        color: #3b4151 !important;
      }
      
      body:not(.dark-mode) .swagger-ui .info .description {
        color: #6b7280 !important;
      }
      
      /* Enhanced Dark Mode Styles for Better Readability */
      body.dark-mode {
        background-color: #1a1a1a !important;
        color: #e0e0e0 !important;
      }
      
      body.dark-mode .swagger-ui {
        background: #1a1a1a !important;
        color: #e0e0e0 !important;
      }
      
      /* Dark mode text and backgrounds */
      body.dark-mode .swagger-ui .info .title {
        color: #ffffff !important;
      }
      
      body.dark-mode .swagger-ui .info .description {
        color: #b0b0b0 !important;
      }
      
      body.dark-mode .swagger-ui .scheme-container {
        background: #2d2d2d !important;
      }
      
      body.dark-mode .swagger-ui .opblock-summary {
        background: #2d2d2d !important;
        color: #ffffff !important;
        border: 1px solid #404040 !important;
      }
      
      body.dark-mode .swagger-ui .opblock-summary:hover {
        background: #3d3d3d !important;
      }
      
      body.dark-mode .swagger-ui .opblock {
        background: #252525 !important;
        border: 1px solid #404040 !important;
      }
      
      body.dark-mode .swagger-ui .opblock .opblock-section-header {
        background: #2d2d2d !important;
        color: #ffffff !important;
      }
      
      body.dark-mode .swagger-ui .opblock-description-wrapper,
      body.dark-mode .swagger-ui .opblock-external-docs-wrapper,
      body.dark-mode .swagger-ui .opblock-title_normal {
        color: #b0b0b0 !important;
      }
      
      body.dark-mode .swagger-ui .parameter__name {
        color: #4fc3f7 !important;
      }
      
      body.dark-mode .swagger-ui .parameter__type {
        color: #66bb6a !important;
      }
      
      body.dark-mode .swagger-ui .parameter__deprecated {
        color: #ff9800 !important;
      }
      
      body.dark-mode .swagger-ui .response-col_status {
        color: #81c784 !important;
      }
      
      body.dark-mode .swagger-ui .response-col_description {
        color: #b0b0b0 !important;
      }
      
      body.dark-mode .swagger-ui .model-title {
        color: #ffffff !important;
      }
      
      body.dark-mode .swagger-ui .model {
        background: #2d2d2d !important;
        border: 1px solid #404040 !important;
      }
      
      body.dark-mode .swagger-ui .model-toggle {
        color: #4fc3f7 !important;
      }
      
      body.dark-mode .swagger-ui table thead tr td,
      body.dark-mode .swagger-ui table thead tr th {
        background: #2d2d2d !important;
        color: #ffffff !important;
        border-bottom: 1px solid #404040 !important;
      }
      
      body.dark-mode .swagger-ui table tbody tr td {
        background: #252525 !important;
        color: #b0b0b0 !important;
        border-bottom: 1px solid #333333 !important;
      }
      
      body.dark-mode .swagger-ui .btn {
        background: #007d9c !important;
        color: #ffffff !important;
        border: 1px solid #007d9c !important;
      }
      
      body.dark-mode .swagger-ui .btn:hover {
        background: #005f73 !important;
        border-color: #005f73 !important;
      }
      
      body.dark-mode .swagger-ui .btn.execute {
        background: #4caf50 !important;
        border-color: #4caf50 !important;
      }
      
      body.dark-mode .swagger-ui .btn.execute:hover {
        background: #45a049 !important;
        border-color: #45a049 !important;
      }
      
      body.dark-mode .swagger-ui .btn.cancel {
        background: #f44336 !important;
        border-color: #f44336 !important;
      }
      
      body.dark-mode .swagger-ui .btn.cancel:hover {
        background: #d32f2f !important;
        border-color: #d32f2f !important;
      }
      
      body.dark-mode .swagger-ui input[type=text],
      body.dark-mode .swagger-ui input[type=password],
      body.dark-mode .swagger-ui input[type=search],
      body.dark-mode .swagger-ui input[type=email],
      body.dark-mode .swagger-ui textarea {
        background: #2d2d2d !important;
        color: #ffffff !important;
        border: 1px solid #404040 !important;
      }
      
      body.dark-mode .swagger-ui input[type=text]:focus,
      body.dark-mode .swagger-ui input[type=password]:focus,
      body.dark-mode .swagger-ui input[type=search]:focus,
      body.dark-mode .swagger-ui input[type=email]:focus,
      body.dark-mode .swagger-ui textarea:focus {
        border-color: #007d9c !important;
        box-shadow: 0 0 0 2px rgba(0, 125, 156, 0.2) !important;
      }
      
      body.dark-mode .swagger-ui select {
        background: #2d2d2d !important;
        color: #ffffff !important;
        border: 1px solid #404040 !important;
      }
      
      body.dark-mode .swagger-ui .auth-wrapper {
        background: #2d2d2d !important;
        border: 1px solid #404040 !important;
      }
      
      body.dark-mode .swagger-ui .auth-container .auth-wrapper .auth-title {
        color: #ffffff !important;
      }
      
      body.dark-mode .swagger-ui .responses-inner h4,
      body.dark-mode .swagger-ui .responses-inner h5 {
        color: #ffffff !important;
      }
      
      body.dark-mode .swagger-ui .highlight-code {
        background: #1e1e1e !important;
      }
      
      body.dark-mode .swagger-ui .microlight {
        color: #d4d4d4 !important;
      }
      
      /* HTTP Method Colors */
      body.dark-mode .swagger-ui .http-method.get .opblock-summary-method {
        background: #61affe !important;
      }
      
      body.dark-mode .swagger-ui .http-method.post .opblock-summary-method {
        background: #49cc90 !important;
      }
      
      body.dark-mode .swagger-ui .http-method.put .opblock-summary-method {
        background: #fca130 !important;
      }
      
      body.dark-mode .swagger-ui .http-method.patch .opblock-summary-method {
        background: #50e3c2 !important;
      }
      
      body.dark-mode .swagger-ui .http-method.delete .opblock-summary-method {
        background: #f93e3e !important;
      }
      
      /* Auto dark mode based on system preference - only when no manual preference is set */
      @media (prefers-color-scheme: dark) {
        body:not(.dark-mode):not(.light-mode) {
          background-color: #1a1a1a !important;
          color: #e0e0e0 !important;
        }
        
        body:not(.dark-mode):not(.light-mode) .swagger-ui {
          background: #1a1a1a !important;
          color: #e0e0e0 !important;
        }
        
        body:not(.dark-mode):not(.light-mode) .swagger-ui .info .title {
          color: #ffffff !important;
        }
      }
      
      /* Dark mode toggle button */
      .dark-mode-toggle {
        position: fixed;
        top: 10px;
        right: 10px;
        z-index: 9999;
        background: #007d9c;
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        transition: all 0.3s ease;
      }
      
      .dark-mode-toggle:hover {
        background: #005f73;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
      }
    `;
  }

  private static getCustomJS(): string {
    return `
      window.addEventListener('load', function() {
        // Add dark mode toggle button
        const toggleButton = document.createElement('button');
        toggleButton.innerHTML = '🌙 Dark Mode';
        toggleButton.className = 'dark-mode-toggle';
        toggleButton.id = 'dark-mode-toggle';
        
        // Check for saved theme preference or default to 'light'
        const currentTheme = localStorage.getItem('swagger-theme') || 'light';
        if (currentTheme === 'dark') {
          document.body.classList.add('dark-mode');
          document.body.classList.remove('light-mode');
          toggleButton.innerHTML = '☀️ Light Mode';
        } else {
          document.body.classList.add('light-mode');
          document.body.classList.remove('dark-mode');
          toggleButton.innerHTML = '🌙 Dark Mode';
        }
        
        toggleButton.addEventListener('click', function() {
          // Toggle between dark and light mode
          if (document.body.classList.contains('dark-mode')) {
            document.body.classList.remove('dark-mode');
            document.body.classList.add('light-mode');
            toggleButton.innerHTML = '🌙 Dark Mode';
            localStorage.setItem('swagger-theme', 'light');
          } else {
            document.body.classList.remove('light-mode');
            document.body.classList.add('dark-mode');
            toggleButton.innerHTML = '☀️ Light Mode';
            localStorage.setItem('swagger-theme', 'dark');
          }
        });
        
        document.body.appendChild(toggleButton);
      });
    `;
  }
}
