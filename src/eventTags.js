const eventTags = [
    'French cuisine',
    'Chinese cuisine',
    'Japanese cuisine',
    'Italian cuisine',
    'Greek cuisine',
    'Spanish cuisine',
    'Mediterranean cuisine',
    'Lebanese cuisine',
    'Moroccan cuisine',
    'Turkish cuisine',
    'Thai cuisine',
    'Indian cuisine',
    'Cajun cuisine',
    'Mexican cuisine',
    'Caribbean cuisine',
    'German cuisine',
    'Russian cuisine',
    'Hungarian cuisine',
    'American cuisine',
    'Vegetarian',
    'Vegan',
    'Restaurant',
    'Cafe',
    'Bakery',
    'Boba shop',
    'Breakfast',
    'Lunch',
    'Dinner',
    'Dessert',
    'Snacks',
    'Drinks',
    'Pizza',
    'Sushi',
    'Sashimi',
    'Burgers',
    'Tacos',
    'Ramen',
    'Pho',
    'Vermicelli',
    'Udon',
    'Noodles',
    'Tofu',
    'Croissant',
    'Pasta',
    'Spaghetti',
    'Korean BBQ',
    'Steak',
    'Dim sum',
    'Dumplings',
    'Soup dumplings',
    'Wontons',
    'Gyoza',
    'Hot pot',
    'Paella',
    'BBQ',
    'Skewers',
    'Shawarma',
    'Rice',
    'Fried rice',
    'Boba',
    'Fruit tea',
    'Taro',
    'Thai tea',
    'Roti',
    'Curry',
    'Indian curry',
    'Japanese curry',
    'Thai curry',
    'French fries',
    'Mochi',
    'Cake',
    'Cupcakes',
    'Risotto',
    'Lasagna',
    'Kimchi',
    'Onigiri',
    'Quiche',
    'Brownies',
    'Fried chicken',
    'Soba',
    'Nachos',
    'Biryani',
    'Shabu-shabu',
    'Mac and cheese',
    'Burritos',
    'Tamal',
    'Miso',
    'Soup',
    'Salad',
    'Cheese',
    'Wasabi',
    'Chutneys',
    'Tonkotsu',
    'Guacamole',
    'Quesadilla',
    'Doughnuts',
    'Naan',
    'Bulgogi',
    'Bibimbap',
    'Cookies',
    'Baguettes',
    'Fajitas',
    'Ceviche',
    'Churrasco',
    'Pad thai',
    'Fish and chips',
    'Milkshakes',
    'Mole',
    'Spring rolls',
    'Macarons',
    'Churros',
    'Borek',
    'Bruschetta',
    'Pie',
    'Dondurma',
    'Chorizos',
    'Durian',
    'Yogurt',
    'Sarma',
    'Strawberry',
    'Chocolate',
    'Vanilla',
    'Lemon',
    'Lime',
    'Mint',
    'Banana',
    'Coconut',
    'Cookies and cream',
    'Caramel',
    'Chocolate chip',
    'Green tea',
    'Raspberry',
    'Orange',
    'Funfetti',
    'Cherry',
    'Watermelon',
    'Grape',
    'Mango',
    'Peppermint',
    'Pistachio',
    'Blue moon',
    'Gold',
    'Fudge',
    'Cheesecake',
    'Tiramisu',
    'Mousse',
    'Red velvet',
    'Cream cheese',
    'Apple',
    'Pineapple',
    'Butter cream',
    'Carrot',
    'Blueberry',
    'Pumpkin',
    'Chestnut',
    'Sponge cake',
    'Coffee',
    'Raisin',
    'Grapefruit',
    'Espresso',
    'Americano',
    'Black coffee',
    'Cappuccino',
    'Latte',
    'Macchiato',
    'Mocha',
    'Frappe',
    'Iced coffee',
    'Art',
    'Interdisciplinary Visual Art',
    'Painting and Drawing',
    'Photomedia',
    'Three Dimensional Forum: Ceramics, Glass, Sculpture',
    'Art History',
    'Composition (Music)',
    'Dance',
    'Creative Studies',
    'Dance Studies',
    'Design',
    'Industrial Design',
    'Interaction Design',
    'Visual Communication Design',
    'Drama',
    'Performance',
    'Design',
    'Ethnomusicology',
    'Guitar',
    'Jazz Studies',
    'Music',
    'Music History',
    'Voice',
    'Early Music',
    'Music Theory',
    'Instrumental',
    'Music Education',
    'Orchestral Instruments',
    'Organ (Music)',
    'Percussion',
    'Orchestral Percussion',
    'Mallet Keyboard',
    'Piano',
    'Voice (Music)',
    'Asian Languages and Culture',
    'Cinema & Media Studies',
    'Classical Studies',
    'Classics',
    'Comparative History of Ideas',
    'English',
    'Creative Writing',
    'Finnish',
    'German Studies',
    'Jewish Studies',
    'Latin',
    'Linguistics',
    'Romance Linguistics',
    'Near Eastern Languages and Civilization',
    'Near Eastern Culture and Civilization',
    'Comparative Islamic Studies',
    'Biblical and Ancient Near Eastern Studies',
    'Norwegian',
    'Scandinavian Studies',
    'Slavic Languages and Literatures',
    'Russian Language, Literature, and Culture',
    'Eastern European Languages, Literatures, and Culture',
    'South Asian Languages and Literature (Hindi and Sanskrit)',
    'Applied and Computational Mathematical Sciences',
    'Biological and Life Sciences',
    'Discrete Mathematics and Algorithms',
    'Engineering and Physical Sciences',
    'Mathematical Economics and Quantitative Finance',
    'Scientific Computing and Numerical Algorithms',
    'Social and Behavioral Sciences',
    'Data Sciences and Statistics',
    'Applied Mathematics',
    'Astronomy',
    'Biochemistry',
    'Biology',
    'Ecology, Evolution, and Conservation',
    'Molecular, Cellular, and Development',
    'Physiology',
    'Plant',
    'Chemistry',
    'Computational Finance and Risk Management',
    'Computer Science',
    'Data Science',
    'Mathematics',
    'Philosophy',
    'Teacher Preparation',
    'Microbiology',
    'Neuroscience',
    'Physics',
    'Comprehensive Physics',
    'Applied Physics',
    'Biophysics',
    'Teacher Preparation',
    'Psychology',
    'Speech and Hearing Sciences',
    'Statistics',
    'American Ethnic Studies',
    'African American Studies',
    'Asian/Pacific American Studies',
    'Chicano Studies',
    'Comparative American Ethnic Studies',
    'American Indian Studies',
    'Anthropology',
    'Anthropology of Globalization',
    'Archaeological Sciences',
    'Human Evolutionary Biology',
    'Medical Anthropology and Global Health',
    'Indigenous Archaeology',
    'Asian Studies',
    'Communication',
    'Journalism and Public Interest Communication',
    'Comparative Religion',
    'Economics',
    'European Studies',
    'Gender, Women, and Sexuality Studies',
    'Geography',
    'Data Science',
    'Cities, Citizenship, and Migration',
    'Environment, Economy, and Sustainability',
    'Globalization, Health, and Development',
    'GIS, Mapping, and Society',
    'Global and Regional Studies',
    'History',
    'History of Empire and Colonialism',
    'History of Religion and Society',
    'History of Race, Gender, and Power',
    'History of War and Society',
    'History and Philosophy of Science',
    'Individualized Studies',
    'Disability Studies',
    'Integrated Social Sciences',
    'Latin American and Caribbean Studies',
    'Law, Societies, and Justice',
    'Philosophy',
    'Political Science',
    'Political Economy',
    'International Security',
    'Sociology',
    'Architectural Design',
    'Architecture',
    'Community, Environment, and Planning',
    'Construction Management',
    'Landscape Architecture',
    'Real Estate',
    'Early Care and Education',
    'Early Childhood and Family Studies',
    'Education, Communities, and Organizations',
    'Aeronautics and Astronautics',
    'Bioengineering',
    'Data Science',
    'Nanoscience and Molecular Engineering',
    'Chemical Engineering',
    'Nanoscience and Molecular Engineering',
    'Civil Engineering',
    'Computer Science and Engineering',
    'Electrical Engineering',
    'Nanoscience and Molecular Engineering',
    'Environmental Engineering',
    'Human Centered Design and Engineering',
    'Industrial Engineering',
    'Materials Science and Engineering',
    'Nanoscience and Molecular Engineering',
    'Mechanical Engineering',
    'Biomechanics',
    'Mechatronics',
    'Nanoscience and Molecular Engineering',
    'Aquatic and Fishery Sciences',
    'Atmospheric Sciences',
    'Atmospheric Chemistry and Air Quality',
    'Climate',
    'Meteorology',
    'Bioresource Science and Engineering',
    'Earth and Space Sciences',
    'Biology',
    'GeoScience',
    'Geology',
    'Physics',
    'Environmental Science and Terrestrial Resource Management',
    'Natural Resource and Environmental Management',
    'Restoration Ecology and Environmental Horticulture',
    'Sustainable Forest Management',
    'Wildlife Conservation',
    'Environmental Studies',
    'Marine Biology',
    'Oceanography',
    'Informatics',
    'Biomedical and Health Informatics',
    'Data Science',
    'Human-Computer Interaction',
    'Information Architecture',
    'Information Assurance and Cybersecurity',
    'Student-Designed Concentration',
    'Business Administration',
    'Accounting',
    'Entrepreneurship',
    'Finance',
    'Human Resources Management',
    'Information Systems',
    'Marketing',
    'Operations and Supply Chain Management',
    'Medical Laboratory Science',
    'Nursing',
    'Environmental Health',
    'Food Systems, Nutrition, and Health',
    'Health Informatics and Health Information Management',
    'Public Health - Global Health',
    'Global Health',
    'Health Education and Promotion',
    'Nutritional Sciences',
    'Social Welfare',
    'Undergrad student',
    'Grad student',
    'Masters',
    'PhD',
    'First year',
    'Second year',
    'Third year',
    'Fourth year',
    'Fifth year',
]

export default eventTags;