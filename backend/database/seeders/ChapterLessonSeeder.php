<?php

namespace Database\Seeders;

use App\Models\Chapter;
use App\Models\Lesson;
use Illuminate\Database\Seeder;

class ChapterLessonSeeder extends Seeder
{
    public function run(): void
    {
        $courseChapters = [
            // Course 1: React Masterclass
            1 => [
                [
                    'title' => 'Getting Started with React',
                    'lessons' => [
                        ['title' => 'What is React and Why Use It?', 'duration' => 8, 'is_free_preview' => 'yes'],
                        ['title' => 'Setting Up Development Environment', 'duration' => 12, 'is_free_preview' => 'yes'],
                        ['title' => 'Creating Your First React App', 'duration' => 15, 'is_free_preview' => 'no'],
                        ['title' => 'Understanding JSX', 'duration' => 10, 'is_free_preview' => 'no'],
                    ],
                ],
                [
                    'title' => 'Components & Props',
                    'lessons' => [
                        ['title' => 'Functional Components', 'duration' => 11, 'is_free_preview' => 'no'],
                        ['title' => 'Props and Data Flow', 'duration' => 14, 'is_free_preview' => 'no'],
                        ['title' => 'Component Composition', 'duration' => 9, 'is_free_preview' => 'no'],
                        ['title' => 'Children Props Pattern', 'duration' => 8, 'is_free_preview' => 'no'],
                    ],
                ],
                [
                    'title' => 'React Hooks Deep Dive',
                    'lessons' => [
                        ['title' => 'useState Hook', 'duration' => 16, 'is_free_preview' => 'no'],
                        ['title' => 'useEffect Hook', 'duration' => 18, 'is_free_preview' => 'no'],
                        ['title' => 'useContext Hook', 'duration' => 13, 'is_free_preview' => 'no'],
                        ['title' => 'useReducer Hook', 'duration' => 15, 'is_free_preview' => 'no'],
                        ['title' => 'Custom Hooks', 'duration' => 20, 'is_free_preview' => 'no'],
                    ],
                ],
            ],

            // Course 2: Laravel API
            2 => [
                [
                    'title' => 'Laravel Fundamentals',
                    'lessons' => [
                        ['title' => 'Introduction to Laravel', 'duration' => 10, 'is_free_preview' => 'yes'],
                        ['title' => 'Routing and Controllers', 'duration' => 14, 'is_free_preview' => 'yes'],
                        ['title' => 'Eloquent ORM Basics', 'duration' => 18, 'is_free_preview' => 'no'],
                        ['title' => 'Migrations and Seeders', 'duration' => 12, 'is_free_preview' => 'no'],
                    ],
                ],
                [
                    'title' => 'Building RESTful APIs',
                    'lessons' => [
                        ['title' => 'API Resource Controllers', 'duration' => 16, 'is_free_preview' => 'no'],
                        ['title' => 'Request Validation', 'duration' => 11, 'is_free_preview' => 'no'],
                        ['title' => 'API Resources & Collections', 'duration' => 13, 'is_free_preview' => 'no'],
                        ['title' => 'Error Handling', 'duration' => 9, 'is_free_preview' => 'no'],
                    ],
                ],
                [
                    'title' => 'Authentication & Security',
                    'lessons' => [
                        ['title' => 'Laravel Sanctum Setup', 'duration' => 15, 'is_free_preview' => 'no'],
                        ['title' => 'Token-Based Authentication', 'duration' => 17, 'is_free_preview' => 'no'],
                        ['title' => 'Authorization with Policies', 'duration' => 14, 'is_free_preview' => 'no'],
                        ['title' => 'Rate Limiting & Security', 'duration' => 11, 'is_free_preview' => 'no'],
                    ],
                ],
            ],

            // Course 3: Python Data Science
            3 => [
                [
                    'title' => 'Python Fundamentals',
                    'lessons' => [
                        ['title' => 'Python Installation & Setup', 'duration' => 7, 'is_free_preview' => 'yes'],
                        ['title' => 'Variables and Data Types', 'duration' => 13, 'is_free_preview' => 'yes'],
                        ['title' => 'Control Flow & Loops', 'duration' => 15, 'is_free_preview' => 'no'],
                        ['title' => 'Functions & Modules', 'duration' => 12, 'is_free_preview' => 'no'],
                    ],
                ],
                [
                    'title' => 'Data Analysis with Pandas',
                    'lessons' => [
                        ['title' => 'Introduction to Pandas', 'duration' => 14, 'is_free_preview' => 'no'],
                        ['title' => 'DataFrames & Series', 'duration' => 18, 'is_free_preview' => 'no'],
                        ['title' => 'Data Cleaning Techniques', 'duration' => 16, 'is_free_preview' => 'no'],
                        ['title' => 'Grouping & Aggregation', 'duration' => 13, 'is_free_preview' => 'no'],
                    ],
                ],
            ],

            // Course 4: Flutter
            4 => [
                [
                    'title' => 'Dart Programming Basics',
                    'lessons' => [
                        ['title' => 'Introduction to Dart', 'duration' => 9, 'is_free_preview' => 'yes'],
                        ['title' => 'Variables, Types & Functions', 'duration' => 14, 'is_free_preview' => 'no'],
                        ['title' => 'Object-Oriented Dart', 'duration' => 16, 'is_free_preview' => 'no'],
                    ],
                ],
                [
                    'title' => 'Flutter Widgets',
                    'lessons' => [
                        ['title' => 'Understanding Widget Tree', 'duration' => 11, 'is_free_preview' => 'no'],
                        ['title' => 'Layout Widgets', 'duration' => 15, 'is_free_preview' => 'no'],
                        ['title' => 'Input & Form Widgets', 'duration' => 13, 'is_free_preview' => 'no'],
                        ['title' => 'Navigation & Routing', 'duration' => 17, 'is_free_preview' => 'no'],
                    ],
                ],
            ],

            // Course 5: UI/UX Design
            5 => [
                [
                    'title' => 'Design Fundamentals',
                    'lessons' => [
                        ['title' => 'Principles of Good Design', 'duration' => 12, 'is_free_preview' => 'yes'],
                        ['title' => 'Color Theory for Digital', 'duration' => 10, 'is_free_preview' => 'yes'],
                        ['title' => 'Typography Essentials', 'duration' => 11, 'is_free_preview' => 'no'],
                    ],
                ],
                [
                    'title' => 'Figma Mastery',
                    'lessons' => [
                        ['title' => 'Figma Interface Overview', 'duration' => 8, 'is_free_preview' => 'no'],
                        ['title' => 'Auto Layout Deep Dive', 'duration' => 16, 'is_free_preview' => 'no'],
                        ['title' => 'Components & Variants', 'duration' => 19, 'is_free_preview' => 'no'],
                        ['title' => 'Prototyping & Animations', 'duration' => 14, 'is_free_preview' => 'no'],
                    ],
                ],
            ],

            // Course 6: AWS
            6 => [
                [
                    'title' => 'Cloud Computing Basics',
                    'lessons' => [
                        ['title' => 'What is Cloud Computing?', 'duration' => 10, 'is_free_preview' => 'yes'],
                        ['title' => 'AWS Global Infrastructure', 'duration' => 12, 'is_free_preview' => 'no'],
                        ['title' => 'IAM & Security', 'duration' => 15, 'is_free_preview' => 'no'],
                    ],
                ],
                [
                    'title' => 'Core AWS Services',
                    'lessons' => [
                        ['title' => 'EC2 & Compute Services', 'duration' => 18, 'is_free_preview' => 'no'],
                        ['title' => 'S3 & Storage Services', 'duration' => 14, 'is_free_preview' => 'no'],
                        ['title' => 'RDS & Database Services', 'duration' => 16, 'is_free_preview' => 'no'],
                    ],
                ],
            ],

            // Course 7: Ethical Hacking
            7 => [
                [
                    'title' => 'Introduction to Ethical Hacking',
                    'lessons' => [
                        ['title' => 'What is Ethical Hacking?', 'duration' => 9, 'is_free_preview' => 'yes'],
                        ['title' => 'Setting Up Kali Linux', 'duration' => 16, 'is_free_preview' => 'no'],
                        ['title' => 'Networking Fundamentals', 'duration' => 14, 'is_free_preview' => 'no'],
                    ],
                ],
                [
                    'title' => 'Scanning & Enumeration',
                    'lessons' => [
                        ['title' => 'Nmap Network Scanning', 'duration' => 18, 'is_free_preview' => 'no'],
                        ['title' => 'Vulnerability Assessment', 'duration' => 15, 'is_free_preview' => 'no'],
                        ['title' => 'Web App Penetration Testing', 'duration' => 20, 'is_free_preview' => 'no'],
                    ],
                ],
            ],

            // Course 8: Docker & Kubernetes
            8 => [
                [
                    'title' => 'Docker Fundamentals',
                    'lessons' => [
                        ['title' => 'Understanding Containers', 'duration' => 11, 'is_free_preview' => 'yes'],
                        ['title' => 'Dockerfile & Images', 'duration' => 15, 'is_free_preview' => 'no'],
                        ['title' => 'Docker Compose', 'duration' => 17, 'is_free_preview' => 'no'],
                    ],
                ],
                [
                    'title' => 'Kubernetes Orchestration',
                    'lessons' => [
                        ['title' => 'Kubernetes Architecture', 'duration' => 14, 'is_free_preview' => 'no'],
                        ['title' => 'Pods, Services & Deployments', 'duration' => 19, 'is_free_preview' => 'no'],
                        ['title' => 'Helm Charts & CI/CD', 'duration' => 16, 'is_free_preview' => 'no'],
                    ],
                ],
            ],

            // Course 9: Blockchain
            9 => [
                [
                    'title' => 'Blockchain Fundamentals',
                    'lessons' => [
                        ['title' => 'How Blockchain Works', 'duration' => 13, 'is_free_preview' => 'yes'],
                        ['title' => 'Ethereum & Smart Contracts', 'duration' => 16, 'is_free_preview' => 'no'],
                        ['title' => 'Solidity Programming Basics', 'duration' => 18, 'is_free_preview' => 'no'],
                    ],
                ],
                [
                    'title' => 'Building DApps',
                    'lessons' => [
                        ['title' => 'Web3.js Integration', 'duration' => 15, 'is_free_preview' => 'no'],
                        ['title' => 'Building an NFT Marketplace', 'duration' => 22, 'is_free_preview' => 'no'],
                        ['title' => 'DeFi Protocol Development', 'duration' => 19, 'is_free_preview' => 'no'],
                    ],
                ],
            ],

            // Course 10: Digital Marketing
            10 => [
                [
                    'title' => 'SEO & Content Marketing',
                    'lessons' => [
                        ['title' => 'SEO Fundamentals', 'duration' => 11, 'is_free_preview' => 'yes'],
                        ['title' => 'Keyword Research', 'duration' => 13, 'is_free_preview' => 'no'],
                        ['title' => 'On-Page Optimization', 'duration' => 14, 'is_free_preview' => 'no'],
                    ],
                ],
                [
                    'title' => 'Paid Advertising',
                    'lessons' => [
                        ['title' => 'Google Ads Fundamentals', 'duration' => 16, 'is_free_preview' => 'no'],
                        ['title' => 'Facebook & Instagram Ads', 'duration' => 18, 'is_free_preview' => 'no'],
                        ['title' => 'Analytics & Optimization', 'duration' => 12, 'is_free_preview' => 'no'],
                    ],
                ],
            ],

            // Course 11: Advanced JavaScript
            11 => [
                [
                    'title' => 'Advanced JavaScript Concepts',
                    'lessons' => [
                        ['title' => 'Closures & Scope', 'duration' => 14, 'is_free_preview' => 'yes'],
                        ['title' => 'Prototypes & Inheritance', 'duration' => 16, 'is_free_preview' => 'no'],
                        ['title' => 'Async Patterns (Promises, Async/Await)', 'duration' => 18, 'is_free_preview' => 'no'],
                    ],
                ],
                [
                    'title' => 'TypeScript Essentials',
                    'lessons' => [
                        ['title' => 'TypeScript Setup & Basics', 'duration' => 12, 'is_free_preview' => 'no'],
                        ['title' => 'Interfaces & Generics', 'duration' => 15, 'is_free_preview' => 'no'],
                        ['title' => 'Decorators & Advanced Types', 'duration' => 17, 'is_free_preview' => 'no'],
                    ],
                ],
            ],

            // Course 12: Node.js
            12 => [
                [
                    'title' => 'Node.js Basics',
                    'lessons' => [
                        ['title' => 'Introduction to Node.js', 'duration' => 10, 'is_free_preview' => 'yes'],
                        ['title' => 'Express.js Setup', 'duration' => 13, 'is_free_preview' => 'no'],
                        ['title' => 'Middleware & Routing', 'duration' => 15, 'is_free_preview' => 'no'],
                    ],
                ],
                [
                    'title' => 'Database & Auth',
                    'lessons' => [
                        ['title' => 'MongoDB with Mongoose', 'duration' => 17, 'is_free_preview' => 'no'],
                        ['title' => 'JWT Authentication', 'duration' => 14, 'is_free_preview' => 'no'],
                        ['title' => 'File Uploads & Validation', 'duration' => 12, 'is_free_preview' => 'no'],
                    ],
                ],
            ],

            // Course 13: Machine Learning
            13 => [
                [
                    'title' => 'ML Foundations',
                    'lessons' => [
                        ['title' => 'What is Machine Learning?', 'duration' => 11, 'is_free_preview' => 'yes'],
                        ['title' => 'Linear Regression', 'duration' => 16, 'is_free_preview' => 'no'],
                        ['title' => 'Classification Algorithms', 'duration' => 18, 'is_free_preview' => 'no'],
                    ],
                ],
                [
                    'title' => 'Deep Learning',
                    'lessons' => [
                        ['title' => 'Neural Network Basics', 'duration' => 20, 'is_free_preview' => 'no'],
                        ['title' => 'CNN for Image Recognition', 'duration' => 22, 'is_free_preview' => 'no'],
                        ['title' => 'Model Training & Evaluation', 'duration' => 15, 'is_free_preview' => 'no'],
                    ],
                ],
            ],

            // Course 14: React Native
            14 => [
                [
                    'title' => 'React Native Basics',
                    'lessons' => [
                        ['title' => 'React Native Setup', 'duration' => 12, 'is_free_preview' => 'yes'],
                        ['title' => 'Core Components', 'duration' => 14, 'is_free_preview' => 'no'],
                        ['title' => 'Styling & Flexbox', 'duration' => 11, 'is_free_preview' => 'no'],
                    ],
                ],
                [
                    'title' => 'Advanced React Native',
                    'lessons' => [
                        ['title' => 'React Navigation', 'duration' => 16, 'is_free_preview' => 'no'],
                        ['title' => 'State Management', 'duration' => 15, 'is_free_preview' => 'no'],
                        ['title' => 'Native Modules & APIs', 'duration' => 18, 'is_free_preview' => 'no'],
                    ],
                ],
            ],

            // Course 15: Full Stack Bootcamp
            15 => [
                [
                    'title' => 'Frontend Foundations',
                    'lessons' => [
                        ['title' => 'HTML5 & Semantic Markup', 'duration' => 10, 'is_free_preview' => 'yes'],
                        ['title' => 'CSS3 & Responsive Design', 'duration' => 14, 'is_free_preview' => 'yes'],
                        ['title' => 'JavaScript Essentials', 'duration' => 16, 'is_free_preview' => 'no'],
                    ],
                ],
                [
                    'title' => 'Full Stack Project',
                    'lessons' => [
                        ['title' => 'React Frontend Setup', 'duration' => 13, 'is_free_preview' => 'no'],
                        ['title' => 'Node.js Backend Setup', 'duration' => 15, 'is_free_preview' => 'no'],
                        ['title' => 'MongoDB Integration', 'duration' => 17, 'is_free_preview' => 'no'],
                        ['title' => 'Deployment to Production', 'duration' => 12, 'is_free_preview' => 'no'],
                    ],
                ],
            ],
        ];

        foreach ($courseChapters as $courseId => $chapters) {
            foreach ($chapters as $chapterIndex => $chapterData) {
                $chapter = Chapter::create([
                    'course_id' => $courseId,
                    'title' => $chapterData['title'],
                    'sort_order' => ($chapterIndex + 1) * 100,
                    'status' => 1,
                ]);

                foreach ($chapterData['lessons'] as $lessonIndex => $lessonData) {
                    Lesson::create([
                        'chapter_id' => $chapter->id,
                        'title' => $lessonData['title'],
                        'duration' => $lessonData['duration'],
                        'is_free_preview' => $lessonData['is_free_preview'],
                        'sort_order' => ($lessonIndex + 1) * 100,
                        'status' => 1,
                    ]);
                }
            }
        }
    }
}