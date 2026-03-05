// ===== PRODUCT DATA =====
const PRODUCTS = [
    // HEADWEAR
    { id: 1, name: "Stealth Performance Cap", price: 29.99, category: "headwear", gender: "unisex", image: "🧢", color: "#1a1a1a", sizes: ["S/M", "L/XL"], rating: 4.8, reviews: 234, badge: "bestseller", description: "Lightweight, moisture-wicking cap with curved brim and adjustable snapback. UV protection fabric keeps you cool during outdoor training.", features: ["Moisture-wicking fabric", "UV protection UPF 50+", "Adjustable snapback closure", "Laser-cut ventilation holes", "Reflective logo detail"] },
    { id: 2, name: "Compression Headband", price: 14.99, category: "headwear", gender: "unisex", image: "🎽", color: "#333", sizes: ["One Size"], rating: 4.6, reviews: 189, description: "Keep sweat out of your eyes with this ultra-stretch compression headband. Features silicone grip strips for a stay-put fit.", features: ["Ultra-stretch fabric", "Silicone grip strips", "Quick-dry technology", "Anti-slip design", "Machine washable"] },
    { id: 3, name: "Thermal Training Beanie", price: 24.99, category: "headwear", gender: "unisex", image: "🧢", color: "#222", sizes: ["One Size"], rating: 4.7, reviews: 156, badge: "new", description: "Fleece-lined thermal beanie perfect for cold-weather outdoor training. Breathable yet insulating to keep your head warm without overheating.", features: ["Fleece-lined interior", "Breathable mesh panels", "Reflective detailing", "Wind-resistant", "Lightweight construction"] },

    // HANDWEAR
    { id: 4, name: "Pro Lifting Gloves", price: 39.99, category: "handwear", gender: "unisex", image: "🧤", color: "#111", sizes: ["S", "M", "L", "XL"], rating: 4.9, reviews: 567, badge: "bestseller", description: "Premium leather palm lifting gloves with integrated wrist support. Double-stitched for maximum durability during heavy deadlifts and rows.", features: ["Genuine leather palms", "Integrated wrist wraps", "Padded palm protection", "Double-stitched seams", "Ventilated mesh back"] },
    { id: 5, name: "Competition Wrist Wraps", price: 24.99, category: "handwear", gender: "unisex", image: "🤜", color: "#1a1a1a", sizes: ["18\"", "24\""], rating: 4.8, reviews: 412, description: "Stiff competition-grade wrist wraps providing maximum support during heavy pressing movements. Thumb loop and velcro closure for secure fit.", features: ["Heavy-duty cotton blend", "Thumb loop attachment", "Hook & loop closure", "IPF approved stiffness", "Available in 18\" and 24\""] },
    { id: 6, name: "Grip Training Gloves", price: 34.99, category: "handwear", gender: "unisex", image: "🧤", color: "#2a2a2a", sizes: ["S", "M", "L", "XL"], rating: 4.7, reviews: 298, badge: "new", description: "Silicone-padded grip gloves designed for CrossFit and functional training. Half-finger design allows natural feel while protecting your palms.", features: ["Silicone grip pads", "Half-finger design", "Pull-tab for easy removal", "Anti-blister technology", "Reinforced stitching"] },

    // UPPERWEAR - MEN
    { id: 7, name: "Apex Performance Tank", price: 34.99, category: "upperwear", gender: "men", image: "🎽", color: "#0a0a0a", sizes: ["S", "M", "L", "XL", "XXL"], rating: 4.8, reviews: 823, badge: "bestseller", description: "Our flagship men's tank top. Ultra-lightweight DryFlex fabric wicks moisture instantly. Athletic cut with dropped armholes for maximum mobility.", features: ["DryFlex moisture-wicking fabric", "Dropped armhole cut", "Flatlock seams (anti-chafing)", "Reflective logo", "Machine washable"] },
    { id: 8, name: "Iron Pump Stringer", price: 29.99, category: "upperwear", gender: "men", image: "🎽", color: "#1a1a1a", sizes: ["S", "M", "L", "XL"], rating: 4.7, reviews: 654, description: "Classic Y-back stringer tank built for serious lifters. Deep cut sides show off your hard work while the slim fit hugs your physique.", features: ["Cotton-poly blend", "Y-back racerback design", "Deep cut sides", "Tapered fit", "Pre-shrunk fabric"] },
    { id: 9, name: "Tech Training Tee", price: 39.99, category: "upperwear", gender: "men", image: "👕", color: "#111", sizes: ["S", "M", "L", "XL", "XXL"], rating: 4.9, reviews: 1021, badge: "bestseller", description: "The ultimate training t-shirt. 4-way stretch fabric moves with you through every exercise. Anti-odor treatment keeps you fresh all session.", features: ["4-way stretch fabric", "Anti-odor treatment", "Raglan sleeves", "Mesh ventilation panels", "Quick-dry technology"] },
    { id: 10, name: "Phantom Hoodie", price: 69.99, category: "upperwear", gender: "men", image: "🧥", color: "#0d0d0d", sizes: ["S", "M", "L", "XL", "XXL"], rating: 4.8, reviews: 445, badge: "new", description: "Heavyweight cotton-blend hoodie with a sleek, tapered fit. Features kangaroo pocket, thumbhole cuffs, and oversized hood for that stealth look.", features: ["320gsm heavyweight cotton", "Tapered athletic fit", "Thumbhole cuffs", "Oversized hood", "Ribbed hem and cuffs"] },

    // UPPERWEAR - WOMEN
    { id: 11, name: "Sculpt Sports Bra", price: 44.99, category: "upperwear", gender: "women", image: "👙", color: "#1a1a1a", sizes: ["XS", "S", "M", "L", "XL"], rating: 4.9, reviews: 1245, badge: "bestseller", description: "High-impact sports bra with seamless construction and adjustable straps. Engineered support for intense training without compromising comfort.", features: ["High-impact support", "Seamless construction", "Adjustable straps", "Moisture-wicking fabric", "Removable pads"] },
    { id: 12, name: "Power Crop Top", price: 34.99, category: "upperwear", gender: "women", image: "👕", color: "#222", sizes: ["XS", "S", "M", "L"], rating: 4.7, reviews: 678, description: "Cropped training top with built-in shelf bra. Ribbed fabric provides extra stretch and a flattering silhouette during every movement.", features: ["Built-in shelf bra", "Ribbed stretch fabric", "Cropped length", "Flatlock seams", "Four-way stretch"] },
    { id: 13, name: "Flow Racerback Tank", price: 29.99, category: "upperwear", gender: "women", image: "🎽", color: "#151515", sizes: ["XS", "S", "M", "L", "XL"], rating: 4.8, reviews: 534, description: "Lightweight racerback tank with mesh panel detailing. Loose, flowy fit that looks great paired with leggings or shorts for any workout.", features: ["Lightweight fabric", "Racerback design", "Mesh panel details", "Relaxed fit", "Quick-dry technology"] },
    { id: 14, name: "Storm Zip Hoodie", price: 74.99, category: "upperwear", gender: "women", image: "🧥", color: "#0f0f0f", sizes: ["XS", "S", "M", "L", "XL"], rating: 4.8, reviews: 389, badge: "new", description: "Full-zip hoodie with a slim, feminine cut. Tech fleece interior keeps you warm during warmups. Hidden zippered pockets for secure storage.", features: ["Tech fleece interior", "Slim feminine cut", "Full-zip front", "Hidden zip pockets", "Thumbhole cuffs"] },

    // LOWERWEAR - MEN
    { id: 15, name: "Titan Training Shorts", price: 39.99, category: "lowerwear", gender: "men", image: "🩳", color: "#111", sizes: ["S", "M", "L", "XL", "XXL"], rating: 4.8, reviews: 901, badge: "bestseller", description: "7-inch inseam training shorts with built-in compression liner. Zippered pockets and 4-way stretch for unrestricted movement during squats and lunges.", features: ["Built-in compression liner", "7\" inseam", "Zippered side pockets", "4-way stretch", "Anti-ride-up design"] },
    { id: 16, name: "Stealth Joggers", price: 59.99, category: "lowerwear", gender: "men", image: "👖", color: "#0e0e0e", sizes: ["S", "M", "L", "XL", "XXL"], rating: 4.9, reviews: 756, badge: "bestseller", description: "Tapered slim-fit joggers in technical cotton blend. Zippered ankle cuffs, elastic waistband with drawcord, and deep zippered pockets.", features: ["Technical cotton blend", "Tapered slim fit", "Zippered ankle cuffs", "Elastic waistband", "Deep zippered pockets"] },
    { id: 17, name: "Compression Tights", price: 49.99, category: "lowerwear", gender: "men", image: "🦵", color: "#0a0a0a", sizes: ["S", "M", "L", "XL"], rating: 4.6, reviews: 421, description: "Full-length compression tights providing muscle support and improved blood flow. Flatlock seams prevent chafing during long sessions.", features: ["Graduated compression", "Flatlock seams", "Moisture-wicking", "UPF 30 sun protection", "Reflective details"] },

    // LOWERWEAR - WOMEN
    { id: 18, name: "Sculpt High-Rise Leggings", price: 64.99, category: "lowerwear", gender: "women", image: "🦵", color: "#111", sizes: ["XS", "S", "M", "L", "XL"], rating: 4.9, reviews: 2134, badge: "bestseller", description: "Our #1 selling legging. Buttery-soft fabric with squat-proof coverage and a high-rise waistband that stays put. Side pocket fits your phone.", features: ["Squat-proof fabric", "High-rise waistband", "Side phone pocket", "Buttery-soft feel", "4-way stretch"] },
    { id: 19, name: "Flex Training Shorts", price: 34.99, category: "lowerwear", gender: "women", image: "🩳", color: "#1a1a1a", sizes: ["XS", "S", "M", "L", "XL"], rating: 4.7, reviews: 567, description: "High-waisted training shorts with built-in brief liner. 5-inch inseam provides coverage while allowing full range of motion for lunges and jumps.", features: ["Built-in brief liner", "High-waisted fit", "5\" inseam", "Lightweight fabric", "Drawcord waistband"] },
    { id: 20, name: "Luxe Flare Pants", price: 69.99, category: "lowerwear", gender: "women", image: "👖", color: "#0d0d0d", sizes: ["XS", "S", "M", "L"], rating: 4.8, reviews: 345, badge: "new", description: "High-rise flare yoga pants that transition from studio to street. Crossover waistband and ultra-soft modal fabric for all-day comfort.", features: ["Crossover waistband", "Flare leg opening", "Modal fabric blend", "High-rise fit", "Side pockets"] },

    // FOOTWEAR
    { id: 21, name: "Apex Trainer Pro", price: 129.99, category: "footwear", gender: "men", image: "👟", color: "#0a0a0a", sizes: ["8", "9", "10", "11", "12", "13"], rating: 4.8, reviews: 678, badge: "bestseller", description: "Versatile cross-training shoe with flat, stable sole for lifting and responsive cushioning for cardio. Rope-guard sidewall protects during rope climbs.", features: ["Flat stable heel for lifting", "Responsive forefoot cushion", "Rope-guard sidewall", "Breathable mesh upper", "Rubber outsole grip"] },
    { id: 22, name: "Lift Max Powerlifting Shoe", price: 149.99, category: "footwear", gender: "unisex", image: "👞", color: "#111", sizes: ["6", "7", "8", "9", "10", "11", "12", "13"], rating: 4.9, reviews: 432, description: "Competition-grade powerlifting shoe with raised heel and metatarsal strap. Rigid sole provides a rock-solid base for heavy squats and Olympic lifts.", features: ["Raised heel (0.75\")", "Metatarsal strap", "Rigid non-compressible sole", "Leather upper", "Anti-slip rubber outsole"] },
    { id: 23, name: "Swift Run Trainer", price: 119.99, category: "footwear", gender: "women", image: "👟", color: "#1a1a1a", sizes: ["5", "6", "7", "8", "9", "10"], rating: 4.7, reviews: 523, badge: "new", description: "Lightweight trainer designed for HIIT and cardio-focused sessions. Responsive foam midsole and breathable knit upper for maximum agility.", features: ["Responsive foam midsole", "Breathable knit upper", "Lightweight (7.5oz)", "Flexible outsole", "Padded collar"] },
    { id: 24, name: "Elite Performance Socks (3-Pack)", price: 24.99, category: "footwear", gender: "unisex", image: "🧦", color: "#222", sizes: ["S (6-8)", "M (8-10)", "L (10-13)"], rating: 4.8, reviews: 890, badge: "bestseller", description: "Cushioned crew-length performance socks with arch compression and moisture-wicking yarns. Reinforced heel and toe for durability. 3-pack.", features: ["Cushioned sole", "Arch compression", "Moisture-wicking", "Reinforced heel & toe", "3-pack value"] },

    // ACCESSORIES
    { id: 25, name: "Tactical Gym Bag", price: 79.99, category: "accessories", gender: "unisex", image: "🎒", color: "#0e0e0e", sizes: ["One Size"], rating: 4.8, reviews: 567, badge: "bestseller", description: "45L duffel bag with separate shoe compartment, wet pocket, and laptop sleeve. Water-resistant 1000D nylon construction built to last.", features: ["45L capacity", "Shoe compartment", "Wet/dry pocket", "Laptop sleeve (15\")", "Water-resistant 1000D nylon"] },
    { id: 26, name: "Lifting Belt", price: 59.99, category: "accessories", gender: "unisex", image: "🏋️", color: "#1a1a1a", sizes: ["S", "M", "L", "XL"], rating: 4.9, reviews: 789, description: "10mm genuine leather powerlifting belt with single-prong buckle. Provides core support for heavy compound lifts. IPF approved.", features: ["10mm genuine leather", "Single-prong buckle", "4\" width throughout", "IPF approved", "Break-in period included"] },
    { id: 27, name: "Steel Shaker Bottle", price: 19.99, category: "accessories", gender: "unisex", image: "🥤", color: "#111", sizes: ["24oz"], rating: 4.7, reviews: 1234, description: "Double-wall insulated stainless steel shaker with leak-proof lid and mesh blender. Keeps drinks cold for 24 hours. BPA-free.", features: ["Double-wall insulation", "Stainless steel", "Leak-proof lid", "Mesh blender ball", "24oz / 710ml capacity"] },
    { id: 28, name: "Resistance Band Set", price: 34.99, category: "accessories", gender: "unisex", image: "🔄", color: "#222", sizes: ["Set of 5"], rating: 4.8, reviews: 645, badge: "new", description: "Set of 5 latex resistance bands ranging from 5–80 lbs. Includes door anchor, ankle straps, and carry bag. Perfect for warmups and rehab.", features: ["5 resistance levels (5-80 lbs)", "Natural latex rubber", "Door anchor included", "Ankle straps included", "Carry bag included"] },
];

// ===== BLOG DATA =====
const BLOG_POSTS = [
    {
        id: 1,
        title: "The Complete Guide to Pre-Workout Nutrition",
        category: "nutrition",
        date: "Feb 20, 2026",
        readTime: "8 min read",
        image: "🥗",
        excerpt: "What you eat before training can make or break your performance. Learn the science behind optimal pre-workout nutrition and meal timing.",
        content: `
      <p>What you eat before your workout can significantly impact your performance, energy levels, and recovery. Understanding pre-workout nutrition is essential for anyone serious about their fitness goals.</p>
      
      <h2>Why Pre-Workout Nutrition Matters</h2>
      <p>Your body needs fuel to perform. Training on an empty stomach can lead to decreased performance, muscle catabolism, and poor recovery. The right pre-workout meal provides:</p>
      <ul>
        <li><strong>Sustained energy</strong> throughout your session</li>
        <li><strong>Reduced muscle breakdown</strong> during intense training</li>
        <li><strong>Enhanced mental focus</strong> and training intensity</li>
        <li><strong>Better recovery</strong> post-workout</li>
      </ul>
      
      <h2>Macronutrient Breakdown</h2>
      <h3>Carbohydrates — Your Primary Fuel Source</h3>
      <p>Carbs are stored as glycogen in your muscles and liver. During high-intensity exercise, glycogen is your body's preferred fuel source. Aim for 0.5–1g of carbs per kg of bodyweight 1–2 hours before training.</p>
      <p><strong>Best sources:</strong> Oats, rice, sweet potatoes, bananas, whole grain toast</p>
      
      <h3>Protein — Muscle Protection</h3>
      <p>Consuming protein before training elevates amino acid levels in your blood, reducing muscle protein breakdown during your session. Aim for 20–40g of protein pre-workout.</p>
      <p><strong>Best sources:</strong> Chicken breast, Greek yogurt, whey protein, eggs</p>
      
      <h3>Fats — Keep Them Moderate</h3>
      <p>While healthy fats are essential in your overall diet, they slow digestion. Keep fat intake moderate in your pre-workout meal to avoid stomach discomfort during training.</p>
      
      <h2>Timing Your Pre-Workout Meal</h2>
      <table>
        <tr><th>Time Before Workout</th><th>Meal Type</th><th>Example</th></tr>
        <tr><td>2–3 hours</td><td>Full meal</td><td>Chicken, rice, and vegetables</td></tr>
        <tr><td>1–2 hours</td><td>Moderate meal</td><td>Oats with banana and protein powder</td></tr>
        <tr><td>30–60 min</td><td>Light snack</td><td>Banana with a scoop of whey</td></tr>
      </table>
      
      <h2>Sample Pre-Workout Meals</h2>
      <ol>
        <li><strong>The Classic:</strong> Oatmeal + banana + scoop of whey protein</li>
        <li><strong>Quick & Easy:</strong> Rice cakes + peanut butter + honey</li>
        <li><strong>Meal Prep Friendly:</strong> Chicken breast + white rice + spinach</li>
        <li><strong>On-The-Go:</strong> Protein shake + apple</li>
      </ol>
      
      <h2>Key Takeaways</h2>
      <p>Pre-workout nutrition doesn't need to be complicated. Focus on a balanced meal with carbs and protein, time it appropriately, and listen to your body. Experiment with different foods and timing to find what works best for your training style and goals.</p>
    `
    },
    {
        id: 2,
        title: "5 Best Compound Exercises for Full-Body Strength",
        category: "exercises",
        date: "Feb 15, 2026",
        readTime: "6 min read",
        image: "🏋️",
        excerpt: "Build maximum muscle and strength with these 5 essential compound movements. Learn proper form, programming tips, and common mistakes to avoid.",
        content: `
      <p>Compound exercises recruit multiple muscle groups simultaneously, making them the most efficient way to build strength and muscle mass. Here are the 5 essential compound movements every athlete should master.</p>
      
      <h2>1. Barbell Back Squat</h2>
      <p><strong>Primary muscles:</strong> Quadriceps, Glutes, Hamstrings<br>
      <strong>Secondary muscles:</strong> Core, Lower Back, Calves</p>
      <p>The squat is often called the "King of Exercises" for good reason. It recruits more muscle fibers than almost any other exercise and is unmatched for building lower body strength.</p>
      <h3>Key Form Cues:</h3>
      <ul>
        <li>Feet shoulder-width apart, toes slightly out</li>
        <li>Brace your core and maintain a neutral spine</li>
        <li>Push knees out in line with toes</li>
        <li>Descend until hip crease passes below knee line</li>
        <li>Drive through your heels to stand up</li>
      </ul>
      
      <h2>2. Conventional Deadlift</h2>
      <p><strong>Primary muscles:</strong> Hamstrings, Glutes, Lower Back<br>
      <strong>Secondary muscles:</strong> Traps, Forearms, Core</p>
      <p>The deadlift is the ultimate test of total body strength. It develops posterior chain power like no other exercise and teaches you to safely lift objects from the ground.</p>
      <h3>Key Form Cues:</h3>
      <ul>
        <li>Feet hip-width apart, bar over mid-foot</li>
        <li>Hinge at the hips, grip bar just outside knees</li>
        <li>Engage lats ("protect your armpits")</li>
        <li>Push the floor away rather than pulling the bar up</li>
        <li>Lock out by squeezing glutes at the top</li>
      </ul>
      
      <h2>3. Barbell Bench Press</h2>
      <p><strong>Primary muscles:</strong> Chest, Triceps, Front Deltoids<br>
      <strong>Secondary muscles:</strong> Core, Biceps (stabilizers)</p>
      <p>The bench press is the gold standard for upper body pushing strength. When performed correctly, it builds a powerful chest, strong triceps, and stable shoulders.</p>
      
      <h2>4. Overhead Press</h2>
      <p><strong>Primary muscles:</strong> Deltoids, Triceps<br>
      <strong>Secondary muscles:</strong> Upper Chest, Core, Traps</p>
      <p>The overhead press builds impressive shoulder strength and size. It's also a true test of upper body pressing power since there's no bench to support you.</p>
      
      <h2>5. Barbell Row</h2>
      <p><strong>Primary muscles:</strong> Lats, Rhomboids, Rear Deltoids<br>
      <strong>Secondary muscles:</strong> Biceps, Lower Back, Core</p>
      <p>The barbell row balances out all the pressing work and builds a thick, strong back. It's essential for posture, shoulder health, and overall pulling strength.</p>
      
      <h2>Programming These Exercises</h2>
      <p>For strength: 3–5 sets × 3–5 reps at 80–90% of your 1RM<br>
      For muscle growth: 3–4 sets × 8–12 reps at 65–80% of your 1RM<br>
      For endurance: 2–3 sets × 15–20 reps at 50–65% of your 1RM</p>
    `
    },
    {
        id: 3,
        title: "Post-Workout Recovery: What to Eat After Training",
        category: "nutrition",
        date: "Feb 10, 2026",
        readTime: "7 min read",
        image: "🍗",
        excerpt: "Your post-workout meal is the most important meal of the day. Learn what, when, and how much to eat for optimal recovery and muscle growth.",
        content: `
      <p>What you consume after training directly impacts your recovery, muscle growth, and how you'll perform in your next session. The post-workout window is a critical opportunity to refuel and rebuild.</p>
      
      <h2>The Anabolic Window — Myth or Reality?</h2>
      <p>The idea of a strict 30-minute "anabolic window" has been largely debunked. However, consuming a balanced meal within 1–2 hours post-workout is still important for optimal recovery.</p>
      
      <h2>Post-Workout Macros</h2>
      <h3>Protein: The Building Blocks</h3>
      <p>Aim for 30–50g of fast-absorbing protein to kickstart muscle protein synthesis. Whey protein is ideal, but any complete protein source works.</p>
      
      <h3>Carbohydrates: Replenish Glycogen</h3>
      <p>Consuming carbs post-workout replenishes depleted glycogen stores. Aim for 0.5–1g per kg bodyweight. Fast-digesting carbs are preferred immediately post-workout.</p>
      
      <h3>Don't Forget Hydration</h3>
      <p>Replace fluids lost through sweat. Aim for 500–700ml of water per pound of bodyweight lost during training. Add electrolytes if you sweat heavily.</p>
      
      <h2>Top Post-Workout Meal Ideas</h2>
      <ol>
        <li>Protein shake + banana + handful of almonds</li>
        <li>Grilled chicken + sweet potato + steamed broccoli</li>
        <li>Salmon + quinoa + mixed vegetables</li>
        <li>Greek yogurt + granola + mixed berries</li>
        <li>Egg omelet + whole grain toast + avocado</li>
      </ol>
      
      <h2>Supplements to Consider</h2>
      <ul>
        <li><strong>Creatine Monohydrate (5g):</strong> Enhances recovery and strength gains</li>
        <li><strong>BCAAs:</strong> May help reduce soreness (though whole protein is sufficient)</li>
        <li><strong>Tart Cherry Juice:</strong> Natural anti-inflammatory that may reduce DOMS</li>
      </ul>
    `
    },
    {
        id: 4,
        title: "Building the Perfect Push-Pull-Legs Routine",
        category: "exercises",
        date: "Feb 5, 2026",
        readTime: "10 min read",
        image: "💪",
        excerpt: "The push-pull-legs split is one of the most popular and effective training programs. Here's how to design your own PPL routine for maximum gains.",
        content: `
      <p>The Push-Pull-Legs (PPL) split divides your training into three categories based on movement patterns. It's one of the most logical and effective ways to structure your workouts.</p>
      
      <h2>How PPL Works</h2>
      <ul>
        <li><strong>Push Day:</strong> Chest, Shoulders, Triceps (all pushing movements)</li>
        <li><strong>Pull Day:</strong> Back, Biceps, Rear Delts (all pulling movements)</li>
        <li><strong>Legs Day:</strong> Quads, Hamstrings, Glutes, Calves</li>
      </ul>
      
      <h2>Sample Push Day</h2>
      <table>
        <tr><th>Exercise</th><th>Sets × Reps</th></tr>
        <tr><td>Barbell Bench Press</td><td>4 × 6-8</td></tr>
        <tr><td>Incline Dumbbell Press</td><td>3 × 8-10</td></tr>
        <tr><td>Overhead Press</td><td>3 × 8-10</td></tr>
        <tr><td>Cable Lateral Raises</td><td>3 × 12-15</td></tr>
        <tr><td>Tricep Pushdowns</td><td>3 × 10-12</td></tr>
        <tr><td>Overhead Tricep Extension</td><td>3 × 10-12</td></tr>
      </table>
      
      <h2>Sample Pull Day</h2>
      <table>
        <tr><th>Exercise</th><th>Sets × Reps</th></tr>
        <tr><td>Barbell Rows</td><td>4 × 6-8</td></tr>
        <tr><td>Lat Pulldowns</td><td>3 × 8-10</td></tr>
        <tr><td>Seated Cable Rows</td><td>3 × 10-12</td></tr>
        <tr><td>Face Pulls</td><td>3 × 15-20</td></tr>
        <tr><td>Barbell Curls</td><td>3 × 8-10</td></tr>
        <tr><td>Hammer Curls</td><td>3 × 10-12</td></tr>
      </table>
      
      <h2>Sample Leg Day</h2>
      <table>
        <tr><th>Exercise</th><th>Sets × Reps</th></tr>
        <tr><td>Barbell Back Squats</td><td>4 × 6-8</td></tr>
        <tr><td>Romanian Deadlifts</td><td>3 × 8-10</td></tr>
        <tr><td>Leg Press</td><td>3 × 10-12</td></tr>
        <tr><td>Walking Lunges</td><td>3 × 10 each leg</td></tr>
        <tr><td>Leg Curls</td><td>3 × 10-12</td></tr>
        <tr><td>Standing Calf Raises</td><td>4 × 12-15</td></tr>
      </table>
      
      <h2>Programming Frequency</h2>
      <p><strong>Beginner:</strong> PPL × 1 per week (3 training days)<br>
      <strong>Intermediate:</strong> PPL × 2 per week (6 training days)<br>
      <strong>Advanced:</strong> PPL × 2 with a dedicated arm/weak point day</p>
    `
    },
    {
        id: 5,
        title: "Understanding Macros: A Complete Guide to IIFYM",
        category: "nutrition",
        date: "Jan 30, 2026",
        readTime: "9 min read",
        image: "📊",
        excerpt: "If It Fits Your Macros (IIFYM) is a flexible dieting approach. Learn how to calculate your macros and build a sustainable nutrition plan.",
        content: `
      <p>IIFYM (If It Fits Your Macros) is a flexible dieting approach that focuses on hitting specific macronutrient targets rather than restricting specific foods. It's sustainable, effective, and backed by science.</p>
      
      <h2>Step 1: Calculate Your TDEE</h2>
      <p>Your Total Daily Energy Expenditure (TDEE) is the total number of calories your body burns in a day. Use the Harris-Benedict equation as a starting point:</p>
      <p><strong>Men:</strong> BMR = 88.36 + (13.4 × weight in kg) + (4.8 × height in cm) – (5.7 × age)<br>
      <strong>Women:</strong> BMR = 447.6 + (9.2 × weight in kg) + (3.1 × height in cm) – (4.3 × age)</p>
      <p>Multiply by your activity factor: Sedentary (1.2), Light (1.375), Moderate (1.55), Active (1.725), Very Active (1.9)</p>
      
      <h2>Step 2: Set Your Goal</h2>
      <ul>
        <li><strong>Fat Loss:</strong> TDEE minus 300–500 calories</li>
        <li><strong>Maintenance:</strong> Eat at TDEE</li>
        <li><strong>Muscle Gain:</strong> TDEE plus 200–400 calories</li>
      </ul>
      
      <h2>Step 3: Split Your Macros</h2>
      <p><strong>Protein:</strong> 1.6–2.2g per kg of bodyweight (most important macro)<br>
      <strong>Fat:</strong> 0.7–1.2g per kg of bodyweight (essential for hormones)<br>
      <strong>Carbs:</strong> Fill remaining calories with carbs (fuel for performance)</p>
      
      <h2>Tracking Tips</h2>
      <ol>
        <li>Use an app like MyFitnessPal to log your food</li>
        <li>Weigh your food with a kitchen scale for accuracy</li>
        <li>Aim to be within ±5g of your macro targets</li>
        <li>Don't stress about one bad day — consistency over time is what matters</li>
      </ol>
    `
    },
    {
        id: 6,
        title: "The Ultimate Guide to Progressive Overload",
        category: "exercises",
        date: "Jan 25, 2026",
        readTime: "7 min read",
        image: "📈",
        excerpt: "Progressive overload is the single most important principle for building muscle and strength. Here's how to apply it to your training.",
        content: `
      <p>Progressive overload is the gradual increase of stress placed on the body during training. Without it, your body has no reason to adapt, grow, or get stronger. It is the #1 principle of muscle growth.</p>
      
      <h2>What is Progressive Overload?</h2>
      <p>Simply put, progressive overload means doing more over time. This can mean more weight, more reps, more sets, or better form. The key is that your training must become progressively more challenging.</p>
      
      <h2>5 Ways to Progressively Overload</h2>
      <ol>
        <li><strong>Increase Weight:</strong> Add 2.5–5 lbs to the bar each week (the most straightforward method)</li>
        <li><strong>Increase Reps:</strong> Do more reps with the same weight before adding weight</li>
        <li><strong>Increase Sets:</strong> Add an extra set to your working sets</li>
        <li><strong>Improve Form:</strong> Slow down the eccentric, pause at the bottom, increase range of motion</li>
        <li><strong>Decrease Rest Time:</strong> Doing the same work in less time = more volume density</li>
      </ol>
      
      <h2>The Double Progression Method</h2>
      <p>This is the simplest and most effective way to progressively overload. Here's how it works:</p>
      <ol>
        <li>Set a rep range (e.g., 8–12 reps)</li>
        <li>Use a weight where you can do at least 8 reps with good form</li>
        <li>Each session, try to do more reps with the same weight</li>
        <li>Once you can do 12 reps with good form, increase the weight and start back at 8 reps</li>
      </ol>
      
      <h2>Common Mistakes</h2>
      <ul>
        <li>Adding weight too fast (ego lifting)</li>
        <li>Sacrificing form for more weight</li>
        <li>Not tracking your workouts (you can't progress what you don't measure)</li>
        <li>Ignoring recovery (your muscles grow OUTSIDE the gym)</li>
      </ul>
    `
    },
    {
        id: 7,
        title: "Meal Prep 101: Fuel Your Week Like a Pro",
        category: "nutrition",
        date: "Jan 20, 2026",
        readTime: "8 min read",
        image: "🍱",
        excerpt: "Learn how to meal prep efficiently, save time and money, and stay on track with your nutrition goals throughout the busy week.",
        content: `
      <p>Meal prep is the secret weapon of every successful fitness enthusiast. By preparing your meals in advance, you eliminate the guesswork and temptation that derail most nutrition plans.</p>
      
      <h2>Benefits of Meal Prepping</h2>
      <ul>
        <li>Save 5–10 hours per week on cooking and decisions</li>
        <li>Save money by buying ingredients in bulk</li>
        <li>Stay consistent with your macro targets</li>
        <li>Reduce food waste and impulse eating</li>
      </ul>
      
      <h2>Getting Started</h2>
      <h3>Equipment You'll Need</h3>
      <ul>
        <li>Glass or BPA-free meal prep containers (get 14–21)</li>
        <li>A good kitchen scale</li>
        <li>Sheet pans for batch cooking</li>
        <li>A rice cooker or instant pot</li>
      </ul>
      
      <h3>Step-by-Step Meal Prep Sunday</h3>
      <ol>
        <li><strong>Plan:</strong> Write out your meals for the week and create a shopping list</li>
        <li><strong>Shop:</strong> Buy everything in one grocery trip</li>
        <li><strong>Batch cook proteins:</strong> Grill chicken, bake salmon, cook ground turkey</li>
        <li><strong>Batch cook carbs:</strong> Rice, sweet potatoes, quinoa</li>
        <li><strong>Prep vegetables:</strong> Wash, chop, and portion veggies</li>
        <li><strong>Assemble:</strong> Portion into containers with proper macro ratios</li>
        <li><strong>Store:</strong> Refrigerate 3 days' worth, freeze the rest</li>
      </ol>
      
      <h2>Pro Tips</h2>
      <ul>
        <li>Cook proteins to 90% done — they'll finish heating when you reheat</li>
        <li>Keep sauces and dressings separate to prevent sogginess</li>
        <li>Rotate your protein sources weekly to avoid food fatigue</li>
        <li>Invest in quality containers — glass lasts longer and heats more evenly</li>
      </ul>
    `
    },
    {
        id: 8,
        title: "Mobility Work: The Missing Piece of Your Training",
        category: "lifestyle",
        date: "Jan 15, 2026",
        readTime: "6 min read",
        image: "🧘",
        excerpt: "Neglecting mobility work is the fastest path to injury and plateaus. Learn essential stretches and routines to keep your body moving freely.",
        content: `
      <p>Mobility is the foundation that everything else in your fitness journey is built upon. Without adequate mobility, you can't perform exercises safely or effectively, and you're leaving gains on the table.</p>
      
      <h2>Mobility vs Flexibility</h2>
      <p><strong>Flexibility</strong> is passive range of motion (how far a muscle can stretch).<br>
      <strong>Mobility</strong> is active range of motion (how far you can move a joint under control). Mobility is what matters for training.</p>
      
      <h2>The Big 5 Mobility Drills</h2>
      <ol>
        <li><strong>90/90 Hip Stretch:</strong> Opens up internal and external hip rotation</li>
        <li><strong>Thoracic Spine Rotations:</strong> Essential for pressing and overhead movements</li>
        <li><strong>Ankle Dorsiflexion Stretch:</strong> Critical for squat depth</li>
        <li><strong>Shoulder Dislocates:</strong> Improve overhead pressing range of motion</li>
        <li><strong>Deep Squat Hold:</strong> The ultimate lower body mobility drill</li>
      </ol>
      
      <h2>When to Do Mobility Work</h2>
      <ul>
        <li><strong>Pre-workout (5–10 min):</strong> Dynamic stretches targeting the muscles you'll train</li>
        <li><strong>Post-workout (5–10 min):</strong> Static stretches to cool down and restore range of motion</li>
        <li><strong>Rest days (15–20 min):</strong> Full-body mobility routine for recovery</li>
      </ul>
      
      <h2>Recommended Routine</h2>
      <p>Spend 10–15 minutes daily on mobility. Focus on your problem areas — for most lifters, this is hips, thoracic spine, and ankles. Consistency with mobility work will dramatically improve your training performance and reduce injury risk.</p>
    `
    }
];
