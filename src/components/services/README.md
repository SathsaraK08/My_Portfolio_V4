# Services System Documentation

## Overview

The Services System is a comprehensive CRUD (Create, Read, Update, Delete) management system for portfolio services. It allows dynamic management of service offerings through an admin dashboard with a professional frontend display.

## System Architecture

### 📁 File Structure

```
src/
├── app/
│   ├── admin/(dashboard)/services/     # Admin pages (protected)
│   │   ├── page.tsx                    # Services list/management
│   │   ├── new/page.tsx               # Create new service
│   │   └── [id]/page.tsx              # Edit existing service
│   ├── api/
│   │   ├── admin/services/            # Admin API endpoints
│   │   │   ├── route.ts               # List/Create services
│   │   │   └── [id]/route.ts          # Get/Update/Delete service
│   │   └── public/services/           # Public API endpoints
│   │       └── route.ts               # Public services list
│   └── services/[id]/page.tsx         # Public service detail page
├── components/
│   ├── admin/
│   │   └── category-select.tsx        # Category dropdown component
│   ├── templates/
│   │   └── coming-soon-template.tsx   # Reusable coming soon template
│   └── services-section.tsx           # Main services display component
└── prisma/
    └── schema.prisma                  # Database schema
```

## Features

### 🔧 Admin Features
- **CRUD Operations**: Full Create, Read, Update, Delete functionality
- **Image Upload**: Professional image upload with optimization
- **Category Management**: Dropdown with predefined categories + custom options
- **Feature Tags**: Dynamic technology/feature tagging system
- **Visibility Control**: Draft/published state management
- **Featured Services**: Highlight important services
- **Order Management**: Custom display ordering
- **Responsive Admin UI**: Mobile-friendly admin interface

### 🎨 Frontend Features
- **Responsive Grid**: Adaptive layout (1-4 columns based on screen size)
- **Image Display**: Service images with intelligent fallbacks
- **Featured Badges**: Visual highlighting for featured services
- **Technology Tags**: Display of service technologies/tools
- **Service Details**: Individual service detail pages
- **Professional Design**: Matches website theme with light/dark mode support
- **Coming Soon Template**: Reusable template for future enhancements

## Database Schema

```sql
model Service {
  id          String   @id @default(cuid())
  title       String
  description String   @db.Text
  shortDesc   String?  @db.Text
  icon        String?
  image       String?
  features    String[]
  pricing     Json?
  category    String?
  featured    Boolean  @default(false)
  order       Int      @default(0)
  isVisible   Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## API Endpoints

### Public APIs
- `GET /api/public/services` - Fetch all visible services

### Admin APIs (Protected)
- `GET /api/admin/services` - List all services
- `POST /api/admin/services` - Create new service
- `GET /api/admin/services/[id]` - Get specific service
- `PUT /api/admin/services/[id]` - Update service
- `DELETE /api/admin/services/[id]` - Delete service

## Component Usage

### ServicesSection
Main component for displaying services on the homepage:

```tsx
import { ServicesSection } from '@/components/services-section'

// In your page component
<ServicesSection />
```

### CategorySelect
Dropdown component for admin forms:

```tsx
import { CategorySelect } from '@/components/admin/category-select'

<CategorySelect
  value={formData.category}
  onChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
  placeholder="Select a category"
/>
```

### ComingSoonTemplate
Reusable template for service detail pages:

```tsx
import { ComingSoonTemplate } from '@/components/templates/coming-soon-template'

<ComingSoonTemplate
  title="Enhanced Features"
  description="Advanced service features coming soon"
  estimatedLaunch="Q2 2024"
/>
```

## Development Guidelines

### Adding New Service Categories
1. Update `CATEGORY_OPTIONS` in `category-select.tsx`
2. Add corresponding icon mapping in `services-section.tsx`
3. Test dropdown functionality

### Customizing the Coming Soon Template
1. Modify `DEFAULT_FEATURES` in `coming-soon-template.tsx`
2. Update `DEFAULT_CONTACT_CTA` for different CTAs
3. Create service-specific templates as needed

### Styling Guidelines
- Use Tailwind CSS classes consistently
- Follow the website's design system (primary/secondary colors)
- Ensure light/dark mode compatibility
- Maintain responsive design principles

## Testing

### Manual Testing Checklist
- [ ] Create new service with all fields
- [ ] Upload and display service images
- [ ] Test category dropdown functionality
- [ ] Verify featured service display
- [ ] Test responsive grid layout
- [ ] Check service detail page navigation
- [ ] Verify light/dark mode compatibility

## Future Enhancements

### Planned Features (Coming Soon Template)
- Detailed service breakdown pages
- Pricing information display
- Portfolio examples integration
- Direct booking system
- Client testimonials
- Project timeline tools

### Technical Improvements
- Search and filtering functionality
- Service analytics and metrics
- SEO optimization for service pages
- Performance optimization for large datasets
- Automated testing suite

## Security Considerations

- Admin routes are protected by authentication
- Image uploads are validated and processed
- Input sanitization on all form fields
- Proper error handling and user feedback

## Performance Notes

- Services are cached on the frontend
- Images are optimized during upload
- Lazy loading for service grids
- Minimal re-renders with proper state management

## Support

For questions or issues with the Services System:
1. Check this documentation first
2. Review the code comments in each component
3. Test in development environment
4. Contact the development team

---

**Last Updated**: 2024-09-29
**Version**: 2.0.0
**Author**: Portfolio Development Team