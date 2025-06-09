
# Horse Racing Manager

A comprehensive web application for managing racing horses and tracking their performance statistics. Built with React, TypeScript, and Supabase.

## Features

- **Horse Management**: Add, edit, and view detailed horse profiles
- **Performance Tracking**: Monitor racing statistics including speed, acceleration, agility, and more
- **Category Organization**: Organize horses by racing categories (Flat, Hurdle, Steeplechase, etc.)
- **Trait System**: Track horse traits like temperament and racing preferences
- **Training Progress**: Monitor maximum training achievements for each stat
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Technologies Used

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (Database, Authentication, Real-time)
- **State Management**: TanStack Query (React Query)
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React

## Installation

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd horse-racing-manager
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:8080` to view the application.

## User Guide

### Getting Started

1. **Homepage Overview**
   - The main page displays all your horses in a grid layout
   - Use the "Add New Horse" button to create your first horse profile
   - View existing horses in organized cards showing key information

### Adding a New Horse

1. **Click "Add New Horse"** on the homepage
2. **Fill in Basic Information**:
   - **Name**: Enter your horse's name
   - **Age**: Horse's current age
   - **Breed**: Select from available breeds
   - **Color**: Choose the horse's color
   - **Gender**: Select Male, Female, or Gelding

3. **Set Racing Categories**:
   - Choose racing categories (Flat, Hurdle, Steeplechase, etc.)
   - Multiple categories can be selected

4. **Configure Racing Statistics**:
   - **Basic Stats**: Speed, Sprint Energy, Acceleration, Agility, Jump
   - **Breeding Stats**: Stamina, Start, Heart, Temper
   - **All stats range from 0-300**

5. **Add Traits** (Optional):
   - Select up to 5 traits from the dropdown
   - Traits describe racing preferences and temperament
   - Examples: "Likes Firm Ground", "Front Runner", "Stays Well"

6. **Mark Training Achievements**:
   - Check boxes for stats that have reached maximum training
   - Helps track which areas are fully developed

7. **Save**: Click "Add Horse" to save your new horse

### Managing Existing Horses

1. **View Horse Details**: Click on any horse card to see full information
2. **Edit Horse**: Use the edit button to modify any horse's details
3. **Update Stats**: Regularly update racing statistics as horses improve
4. **Track Progress**: Monitor training achievements and performance trends

### Understanding Horse Cards

Each horse card displays:
- **Horse Name and Basic Info**: Name, age, breed, color, gender
- **Categories**: Racing categories as colored badges
- **Key Stats**: Speed, acceleration, and other important metrics
- **Traits**: Behavioral and performance characteristics
- **Training Status**: Visual indicators of maxed-out stats

### Tips for Best Use

1. **Regular Updates**: Keep horse statistics current after races and training
2. **Category Organization**: Use categories to group horses by racing type
3. **Trait Tracking**: Use traits to remember important horse characteristics
4. **Training Goals**: Mark maximum training achievements to track progress
5. **Performance History**: Use the detailed stats to identify strengths and weaknesses

### Racing Categories Explained

- **Flat**: Traditional flat racing on level tracks
- **Hurdle**: Racing with low obstacles
- **Steeplechase**: Racing with higher, more challenging obstacles
- **Cross Country**: Long-distance racing across varied terrain
- **Point to Point**: Amateur steeplechasing between fixed points

### Stat Categories

**Basic Racing Stats**:
- **Speed**: Maximum running speed
- **Sprint Energy**: Burst speed capability
- **Acceleration**: How quickly the horse reaches top speed
- **Agility**: Maneuverability and responsiveness
- **Jump**: Jumping ability for hurdles and steeplechase

**Breeding/Temperament Stats**:
- **Stamina**: Endurance over longer distances
- **Start**: Gate breaking and early race positioning
- **Heart**: Determination and fighting spirit
- **Temper**: Behavioral consistency and trainability

## Support and Development

This application is built with modern web technologies and follows best practices for maintainability and scalability. The codebase is structured with reusable components and clear separation of concerns.

For technical issues or feature requests, please refer to the project's issue tracker or contact the development team.

## License

This project is part of a Lovable application. Please refer to your Lovable project settings for licensing information.
