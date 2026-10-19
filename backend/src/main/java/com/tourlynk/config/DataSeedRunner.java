package com.tourlynk.config;

import com.tourlynk.entity.*;
import com.tourlynk.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
public class DataSeedRunner implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeedRunner.class);

    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final DistrictRepository districtRepository;
    private final DestinationRepository destinationRepository;
    private final BookingRepository bookingRepository;
    private final VehicleMaintenanceRepository maintenanceRepository;
    private final ReviewRepository reviewRepository;
    private final FavoriteRepository favoriteRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.seed-data.enabled:true}")
    private boolean seedEnabled;

    public DataSeedRunner(UserRepository userRepository,
                          VehicleRepository vehicleRepository,
                          DistrictRepository districtRepository,
                          DestinationRepository destinationRepository,
                          BookingRepository bookingRepository,
                          VehicleMaintenanceRepository maintenanceRepository,
                          ReviewRepository reviewRepository,
                          FavoriteRepository favoriteRepository,
                          PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.vehicleRepository = vehicleRepository;
        this.districtRepository = districtRepository;
        this.destinationRepository = destinationRepository;
        this.bookingRepository = bookingRepository;
        this.maintenanceRepository = maintenanceRepository;
        this.reviewRepository = reviewRepository;
        this.favoriteRepository = favoriteRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (!seedEnabled) {
            log.info("Automatic seed data initialization disabled.");
            return;
        }

        seedDistricts();
        seedUsers();
        seedVehicles();
        seedDestinations();
        seedBookingsAndMaintenance();
    }

    private void seedDistricts() {
        if (districtRepository.count() > 0) return;

        List<District> districts = Arrays.asList(
                new District("Ampara", "Eastern"),
                new District("Anuradhapura", "North Central"),
                new District("Badulla", "Uva"),
                new District("Batticaloa", "Eastern"),
                new District("Colombo", "Western"),
                new District("Galle", "Southern"),
                new District("Gampaha", "Western"),
                new District("Hambantota", "Southern"),
                new District("Jaffna", "Northern"),
                new District("Kalutara", "Western"),
                new District("Kandy", "Central"),
                new District("Kegalle", "Sabaragamuwa"),
                new District("Kilinochchi", "Northern"),
                new District("Kurunegala", "North Western"),
                new District("Mannar", "Northern"),
                new District("Matale", "Central"),
                new District("Matara", "Southern"),
                new District("Monaragala", "Uva"),
                new District("Mullaitivu", "Northern"),
                new District("Nuwara Eliya", "Central"),
                new District("Polonnaruwa", "North Central"),
                new District("Puttalam", "North Western"),
                new District("Ratnapura", "Sabaragamuwa"),
                new District("Trincomalee", "Eastern"),
                new District("Vavuniya", "Northern")
        );
        districtRepository.saveAll(districts);
        log.info("Seeded 25 administrative districts of Sri Lanka.");
    }

    private void seedUsers() {
        if (!userRepository.existsByEmail("admin@tourlynk.lk")) {
            User admin = new User(
                    "TourLynk Administrator",
                    "admin@tourlynk.lk",
                    passwordEncoder.encode("Admin@123"),
                    "+94 77 123 4567",
                    "ADMIN"
            );
            userRepository.save(admin);
            log.info("Seeded default administrator: admin@tourlynk.lk / Admin@123");
        }

        if (!userRepository.existsByEmail("john.tourist@example.com")) {
            User user1 = new User(
                    "John Tourist",
                    "john.tourist@example.com",
                    passwordEncoder.encode("User@123"),
                    "+1 415 555 2671",
                    "USER"
            );
            userRepository.save(user1);
        }

        if (!userRepository.existsByEmail("kasun.perera@example.lk")) {
            User user2 = new User(
                    "Kasun Perera",
                    "kasun.perera@example.lk",
                    passwordEncoder.encode("User@123"),
                    "+94 71 987 6543",
                    "USER"
            );
            userRepository.save(user2);
        }
    }

    private void seedVehicles() {
        if (vehicleRepository.count() > 0) return;

        createVehicle("Toyota", "Axio", 2022, "Car",
                "A comfortable, fuel-efficient premium sedan suited for city driving and long-distance Sri Lankan highway touring.",
                "WP-CAB-1024", 5, 2, "Auto", "Hybrid", BigDecimal.valueOf(8000), "AVAILABLE",
                "/assets/images/vehicles/toyota-axio.jpg");

        createVehicle("Toyota", "RAV4", 2023, "SUV",
                "Versatile all-wheel-drive crossover SUV offering supreme comfort, spacious interior, and reliable clearance for mountain roads.",
                "WP-CAG-4482", 5, 3, "Auto", "Petrol", BigDecimal.valueOf(18000), "AVAILABLE",
                "/assets/images/vehicles/toyota-rav4.jpg");

        createVehicle("Toyota", "HiAce", 2021, "Van",
                "Spacious high-roof luxury passenger van, ideal for family holidays, tourist groups, and luggage-heavy Sri Lankan tours.",
                "WP-NA-7821", 12, 6, "Auto", "Diesel", BigDecimal.valueOf(25000), "AVAILABLE",
                "/assets/images/vehicles/toyota-hiace.jpg");

        createVehicle("Toyota", "Prado", 2023, "SUV",
                "Flagship luxury 4x4 Land Cruiser Prado combining legendary off-road capability with executive comfort across all terrains.",
                "WP-CBA-9011", 7, 4, "Auto", "Diesel", BigDecimal.valueOf(28000), "AVAILABLE",
                "/assets/images/vehicles/toyota-prado.jpg");

        createVehicle("Toyota", "Prius", 2022, "Car",
                "Ultra-efficient hybrid hatchback with smooth highway performance and cutting-edge safety features for eco-conscious travelers.",
                "WP-CAC-5590", 5, 3, "Auto", "Hybrid", BigDecimal.valueOf(10500), "AVAILABLE",
                "/assets/images/vehicles/toyota-prius.jpg");

        createVehicle("Toyota", "Aqua", 2021, "Compact",
                "Nimble and highly economical compact car, perfect for navigating narrow Sri Lankan coastal lanes and historic town streets.",
                "WP-CAD-3120", 5, 2, "Auto", "Hybrid", BigDecimal.valueOf(7500), "AVAILABLE",
                "/assets/images/vehicles/toyota-aqua.jpg");

        createVehicle("Nissan", "X-Trail", 2022, "SUV",
                "Modern family SUV equipped with intelligent 4x4 drive, panoramic moonroof, and generous boot space for adventure trips.",
                "WP-CAE-8901", 5, 4, "Auto", "Petrol", BigDecimal.valueOf(16500), "AVAILABLE",
                "/assets/images/vehicles/nissan-xtrail.jpg");

        createVehicle("Honda", "Vezel", 2023, "SUV",
                "Sleek urban crossover featuring dynamic hybrid power, ergonomic interior styling, and flexible magic seating arrangements.",
                "WP-CAF-6211", 5, 3, "Auto", "Hybrid", BigDecimal.valueOf(14000), "AVAILABLE",
                "/assets/images/vehicles/honda-vezel.jpg");

        createVehicle("Suzuki", "Wagon R", 2021, "Compact",
                "Compact tall-boy wagon designed for effortless parking, superior fuel economy, and great headroom on island getaways.",
                "WP-CAH-1194", 4, 2, "Auto", "Petrol", BigDecimal.valueOf(6500), "AVAILABLE",
                "/assets/images/vehicles/suzuki-wagonr.jpg");

        createVehicle("Nissan", "Caravan", 2020, "Van",
                "Robust 14-seater touring van tailored for organized group excursions, airport transfers, and hill country round-trips.",
                "WP-NB-3420", 14, 8, "Auto", "Diesel", BigDecimal.valueOf(24000), "AVAILABLE",
                "/assets/images/vehicles/nissan-caravan.jpg");

        createVehicle("Mitsubishi", "Montero Sport", 2023, "SUV",
                "Muscular 7-seater SUV with high ground clearance, paddle shift transmission, and commanding road presence on highland slopes.",
                "WP-CBI-7342", 7, 5, "Auto", "Diesel", BigDecimal.valueOf(32000), "AVAILABLE",
                "/assets/images/vehicles/mitsubishi-montero.jpg");

        createVehicle("Mercedes-Benz", "E-Class", 2022, "Luxury",
                "Prestige executive luxury saloon offering peerless ride refinement, plush leather upholstery, and VIP hospitality standards.",
                "WP-CBK-9900", 5, 3, "Auto", "Petrol", BigDecimal.valueOf(45000), "AVAILABLE",
                "/assets/images/vehicles/mercedes-eclass.jpg");

        log.info("Seeded 12 vehicles.");
    }

    private void createVehicle(String make, String model, int year, String category, String desc,
                               String reg, int pass, int lugg, String trans, String fuel,
                               BigDecimal rate, String status, String img) {
        Vehicle v = new Vehicle();
        v.setMake(make);
        v.setModel(model);
        v.setManufacturingYear(year);
        v.setCategory(category);
        v.setDescription(desc);
        v.setRegistrationNumber(reg);
        v.setPassengerCapacity(pass);
        v.setLuggageCapacity(lugg);
        v.setTransmission(trans);
        v.setFuelType(fuel);
        v.setDailyRate(rate);
        v.setListingStatus(status);
        v.setPrimaryImageUrl(img);
        v.addImage(new VehicleImage(img, make + " " + model + " View", 1));
        vehicleRepository.save(v);
    }

    private void seedDestinations() {
        if (destinationRepository.count() > 0) return;

        createDestination("Sigiriya Rock Fortress", "sigiriya-rock-fortress", "Matale", "Central",
                "An ancient palace and fortress complex atop a sheer 200m granite monolith, renowned for frescoes and water gardens.",
                "Sigiriya is a UNESCO World Heritage site and an ancient rock fortress located in the northern Matale District. Renowned for its ancient frescoes, Mirror Wall, lion paws entrance, and breathtaking 360-degree views.",
                BigDecimal.valueOf(7.9570), BigDecimal.valueOf(80.7603), "Cultural", "January to April", "3 - 4 hours", "USD 30 (Foreigners)",
                "/assets/images/destinations/sigiriya.jpg", BigDecimal.valueOf(4.8), 1240);

        createDestination("Ella Nine Arch Bridge", "ella-nine-arch-bridge", "Badulla", "Uva",
                "Iconic colonial railway viaduct hidden amidst lush jungle hills and emerald tea plantations near Ella.",
                "The Nine Arch Bridge in Ella is one of the best examples of colonial-era railway construction. Built entirely of solid stone and cement without steel, standing 24 meters high across a scenic green valley.",
                BigDecimal.valueOf(6.8768), BigDecimal.valueOf(81.0608), "Nature", "December to May", "2 hours", "Free admission",
                "/assets/images/destinations/nine-arch-bridge.jpg", BigDecimal.valueOf(4.7), 980);

        createDestination("Galle Fort", "galle-fort", "Galle", "Southern",
                "A vibrant 17th-century seaside fortress built by the Portuguese and Dutch, featuring quaint cobblestone streets and cafes.",
                "Galle Fort is a UNESCO World Heritage monument boasting centuries-old ramparts, boutique hotels, maritime museums, and panoramic ocean sunsets on the southwest coast.",
                BigDecimal.valueOf(6.0270), BigDecimal.valueOf(80.2170), "Cultural", "November to April", "Half day", "Free admission",
                "/assets/images/destinations/galle-fort.jpg", BigDecimal.valueOf(4.6), 1120);

        createDestination("Yala National Park", "yala-national-park", "Hambantota", "Southern",
                "Sri Lanka’s premier wildlife park, boasting the world’s highest density of wild leopards and thriving elephant herds.",
                "Bordering the Indian Ocean, Yala National Park features coastal lagoons, monsoon forests, and rocky outcrops housing leopards, sloth bears, elephants, and hundreds of bird species.",
                BigDecimal.valueOf(6.3686), BigDecimal.valueOf(81.5278), "Wildlife", "February to July", "Full day safari", "USD 40 + Jeep Hire",
                "/assets/images/destinations/yala.jpg", BigDecimal.valueOf(4.5), 880);

        createDestination("Anuradhapura Sacred City", "anuradhapura-sacred-city", "Anuradhapura", "North Central",
                "Cradle of ancient Sri Lankan civilization with sprawling monasteries, soaring stupas, and the sacred Sri Maha Bodhi tree.",
                "Anuradhapura is the ancient capital of Sri Lanka, founded in the 4th century BC. Famous for giant dagobas like Ruwanwelisaya and the venerated Jaya Sri Maha Bodhi.",
                BigDecimal.valueOf(8.3500), BigDecimal.valueOf(80.4167), "Cultural", "Year-round", "Full day", "USD 25",
                "/assets/images/destinations/anuradhapura.jpg", BigDecimal.valueOf(4.7), 650);

        createDestination("Temple of the Sacred Tooth Relic", "temple-of-the-tooth-kandy", "Kandy", "Central",
                "A revered Buddhist temple situated in the royal palace complex of the former Kingdom of Kandy, housing Buddha’s tooth.",
                "Sri Dalada Maligawa is a golden-roofed sanctuary housing Sri Lanka's most sacred religious relic, nestled beside the picturesque Kandy Lake.",
                BigDecimal.valueOf(7.2936), BigDecimal.valueOf(80.6413), "Cultural", "Year-round", "2 - 3 hours", "USD 15 / LKR 2000",
                "/assets/images/destinations/kandy-temple.jpg", BigDecimal.valueOf(4.8), 1430);

        createDestination("Nuwara Eliya & Gregory Lake", "nuwara-eliya-gregory-lake", "Nuwara Eliya", "Central",
                "Known as Little England, characterized by cool mountain climate, colonial bungalows, tea estates, and misty lakes.",
                "Perched at 1,868m altitude, Nuwara Eliya is the tea capital of Sri Lanka, featuring cool crisp climate, Victoria Park, Pedro Tea Estate, and boating on Lake Gregory.",
                BigDecimal.valueOf(6.9538), BigDecimal.valueOf(80.7818), "Nature", "March to June", "1 - 2 days", "Free admission",
                "/assets/images/destinations/nuwara-eliya.jpg", BigDecimal.valueOf(4.6), 910);

        createDestination("Mirissa Beach & Whale Watching", "mirissa-beach", "Matara", "Southern",
                "Crescent-shaped golden beach famous for blue whale watching excursions, vibrant sunsets, and relaxed seaside seafood dining.",
                "Mirissa offers world-class blue whale and dolphin watching safaris, coconut tree hills, surfing point breaks, and tranquil tropical bays.",
                BigDecimal.valueOf(5.9483), BigDecimal.valueOf(80.4589), "Coastal", "November to April", "1 - 2 days", "Free beach access",
                "/assets/images/destinations/mirissa.jpg", BigDecimal.valueOf(4.7), 1050);

        createDestination("Polonnaruwa Ancient City", "polonnaruwa-ancient-city", "Polonnaruwa", "North Central",
                "The medieval second capital of Sri Lanka, showcasing marvels of irrigation and magnificent rock-cut statues at Gal Vihara.",
                "Polonnaruwa features ancient stone palaces, royal baths, and the sublime rock-cut Gal Vihara Buddha statues carved into granite.",
                BigDecimal.valueOf(7.9403), BigDecimal.valueOf(81.0188), "Cultural", "May to September", "Half day", "USD 25",
                "/assets/images/destinations/polonnaruwa.jpg", BigDecimal.valueOf(4.6), 520);

        createDestination("Horton Plains & World’s End", "horton-plains-worlds-end", "Nuwara Eliya", "Central",
                "A windswept cloud forest plateau with breathtaking 880m sheer precipices and crystal-clear Baker’s Falls.",
                "A pristine highland plateau with dramatic drop-offs at World's End, home to sambar deer, endemic bird species, and tranquil walking trails.",
                BigDecimal.valueOf(6.8028), BigDecimal.valueOf(80.8092), "Nature", "January to March", "4 hours", "USD 35",
                "/assets/images/destinations/horton-plains.jpg", BigDecimal.valueOf(4.7), 740);

        createDestination("Dambulla Cave Temple", "dambulla-cave-temple", "Matale", "Central",
                "The largest and best-preserved cave temple complex in Sri Lanka, boasting 153 Buddha statues and stunning mural ceilings.",
                "Dating back to the 1st century BC, five cave monasteries contain hundreds of statues and vibrant Buddhist mural paintings.",
                BigDecimal.valueOf(7.8567), BigDecimal.valueOf(80.6489), "Cultural", "Year-round", "2 hours", "USD 10",
                "/assets/images/destinations/dambulla.jpg", BigDecimal.valueOf(4.7), 830);

        createDestination("Unawatuna Beach", "unawatuna-beach", "Galle", "Southern",
                "A calm horseshoe-shaped turquoise bay protected by coral reefs, ideal for swimming, snorkeling, and beachfront relaxation.",
                "Famous for gentle waves, snorkeling around the Japanese Peace Pagoda, and lively beachfront dining.",
                BigDecimal.valueOf(6.0108), BigDecimal.valueOf(80.2492), "Coastal", "November to April", "1 day", "Free beach access",
                "/assets/images/destinations/unawatuna.jpg", BigDecimal.valueOf(4.5), 690);

        createDestination("Udawalawe National Park", "udawalawe-national-park", "Monaragala", "Uva",
                "Expansive savannah grasslands surrounding a massive reservoir, famous for guaranteed encounters with wild elephant families.",
                "Sri Lanka's top sanctuary for observing wild elephants roaming freely across open grasslands and visiting the Elephant Transit Home.",
                BigDecimal.valueOf(6.4744), BigDecimal.valueOf(80.8986), "Wildlife", "October to April", "Half day safari", "USD 25 + Jeep Hire",
                "/assets/images/destinations/udawalawe.jpg", BigDecimal.valueOf(4.6), 610);

        createDestination("Arugam Bay Surf Haven", "arugam-bay", "Ampara", "Eastern",
                "World-class right-hand point break surf destination celebrated for its bohemian vibe, lagoons, and golden sandbars.",
                "One of the top surfing spots on the planet with peeling right-hand point breaks, relaxed beachfront cafes, and mangrove lagoons.",
                BigDecimal.valueOf(6.8419), BigDecimal.valueOf(81.8344), "Coastal", "May to September", "2 - 3 days", "Free beach access",
                "/assets/images/destinations/arugam-bay.jpg", BigDecimal.valueOf(4.7), 820);

        createDestination("Trincomalee & Koneswaram Temple", "trincomalee-koneswaram", "Trincomalee", "Eastern",
                "Ancient cliffside Hindu temple dedicated to Lord Shiva, overlooking the natural deep-water harbour and Swami Rock.",
                "Perched atop towering sea cliffs, Koneswaram Temple overlooks azure waters where blue whales and dolphins swim offshore.",
                BigDecimal.valueOf(8.5878), BigDecimal.valueOf(81.2417), "Cultural", "March to October", "Half day", "Free admission",
                "/assets/images/destinations/trincomalee.jpg", BigDecimal.valueOf(4.6), 590);

        createDestination("Nilaveli Beach & Pigeon Island", "nilaveli-pigeon-island", "Trincomalee", "Eastern",
                "Pristine white sand coastline and marine national park harboring live coral reefs, blacktip reef sharks, and sea turtles.",
                "Crystal-clear shallow waters ideal for snorkeling with harmless blacktip reef sharks and sea turtles around Pigeon Island.",
                BigDecimal.valueOf(8.6883), BigDecimal.valueOf(81.1897), "Coastal", "April to October", "1 day", "Park fee applies",
                "/assets/images/destinations/nilaveli.jpg", BigDecimal.valueOf(4.8), 770);

        createDestination("Jaffna Fort & Nallur Temple", "jaffna-fort-nallur", "Jaffna", "Northern",
                "The cultural epicentre of Tamil heritage in Sri Lanka, boasting Dutch-era bastions, golden Hindu towers, and unique cuisine.",
                "A historic star-shaped coastal fort overlooking Jaffna lagoon, paired with the vibrant Dravidian towers of Nallur Kovil.",
                BigDecimal.valueOf(9.6615), BigDecimal.valueOf(80.0094), "Cultural", "January to September", "1 - 2 days", "Free admission",
                "/assets/images/destinations/jaffna.jpg", BigDecimal.valueOf(4.5), 430);

        createDestination("Adam’s Peak (Sri Pada)", "adams-peak-sri-pada", "Ratnapura", "Sabaragamuwa",
                "Sacred 2,243m conical mountain climbed by pilgrims of four religions for its sacred footprint and mystical sunrise shadow.",
                "A nighttime pilgrimage climb leading to an unforgettable sunrise where the mountain casts a sharp triangular shadow on the clouds below.",
                BigDecimal.valueOf(6.8096), BigDecimal.valueOf(80.4994), "Adventure", "December to May", "6 - 8 hours climb", "Free admission",
                "/assets/images/destinations/adams-peak.jpg", BigDecimal.valueOf(4.9), 1310);

        createDestination("Bentota Beach & Watersports", "bentota-beach", "Galle", "Southern",
                "Golden sandy peninsula flanked by the Indian Ocean and Bentota River, offering jet skiing, windsurfing, and luxury resorts.",
                "A premier hub for water sports, jet skiing, mangrove river cruises, and sea turtle conservation projects.",
                BigDecimal.valueOf(6.4256), BigDecimal.valueOf(79.9997), "Coastal", "October to April", "1 day", "Free beach access",
                "/assets/images/destinations/bentota.jpg", BigDecimal.valueOf(4.6), 680);

        createDestination("Hikkaduwa Coral Sanctuary", "hikkaduwa-coral-sanctuary", "Galle", "Southern",
                "Celebrated marine reserve renowned for sea turtle feeding on the beach shore, colorful coral reefs, and vibrant surf breaks.",
                "Famous for wild giant green sea turtles that swim up to the beach shore daily to feed on seagrass from visitors' hands.",
                BigDecimal.valueOf(6.1408), BigDecimal.valueOf(80.1017), "Coastal", "November to April", "1 day", "Free beach access",
                "/assets/images/destinations/hikkaduwa.jpg", BigDecimal.valueOf(4.5), 750);

        createDestination("Sinharaja Rain Forest Reserve", "sinharaja-rain-forest", "Ratnapura", "Sabaragamuwa",
                "A virgin tropical rainforest UNESCO biosphere reserve home to over 50% of Sri Lanka’s endemic mammals, birds, and flora.",
                "The last remaining primary lowland rainforest on the island, featuring towering dipterocarp trees, birds, and clear mountain streams.",
                BigDecimal.valueOf(6.4167), BigDecimal.valueOf(80.4667), "Nature", "December to April", "Full day", "USD 10 + Guide",
                "/assets/images/destinations/sinharaja.jpg", BigDecimal.valueOf(4.7), 510);

        createDestination("Pinnawala Elephant Orphanage", "pinnawala-elephant-orphanage", "Kegalle", "Sabaragamuwa",
                "A conservation center caring for orphaned and injured wild Asian elephants, famous for twice-daily river bathing spectacles.",
                "Witness large herds of Asian elephants splashing and playing in the Maha Oya river during daily bathing sessions.",
                BigDecimal.valueOf(7.3009), BigDecimal.valueOf(80.3867), "Wildlife", "Year-round", "3 hours", "USD 20",
                "/assets/images/destinations/pinnawala.jpg", BigDecimal.valueOf(4.4), 890);

        createDestination("Colombo Lotus Tower & City", "colombo-lotus-tower", "Colombo", "Western",
                "South Asia’s tallest self-supported tower offering 360-degree observation decks over Colombo harbour and skyline.",
                "Standing 350 meters tall, the Lotus Tower provides panoramic skyline vistas, revolving fine dining, and futuristic illumination.",
                BigDecimal.valueOf(6.9271), BigDecimal.valueOf(79.8612), "Cultural", "Year-round", "2 hours", "USD 20 / LKR 500",
                "/assets/images/destinations/colombo.jpg", BigDecimal.valueOf(4.5), 940);

        createDestination("Negombo Lagoon & Fish Market", "negombo-lagoon", "Gampaha", "Western",
                "Charming coastal fishing hub near Bandaranaike Airport, noted for colorful outrigger catamarans and Dutch colonial canals.",
                "Known for century-old catamarans returning at dawn with fresh catches, Dutch canal tours, and proximity to Colombo International Airport.",
                BigDecimal.valueOf(7.2083), BigDecimal.valueOf(79.8358), "Coastal", "November to April", "Half day", "Free admission",
                "/assets/images/destinations/negombo.jpg", BigDecimal.valueOf(4.4), 490);

        createDestination("Wilpattu National Park", "wilpattu-national-park", "Puttalam", "North Western",
                "Sri Lanka’s largest national park, characterized by over 100 natural sand-rimmed water basins (willus) and solitary leopards.",
                "Famous for natural rainwater basins called Willus, offering peaceful wildlife safaris tracking leopards, spotted deer, and bears.",
                BigDecimal.valueOf(8.4550), BigDecimal.valueOf(80.0028), "Wildlife", "February to October", "Full day safari", "USD 30 + Jeep",
                "/assets/images/destinations/wilpattu.jpg", BigDecimal.valueOf(4.6), 420);

        log.info("Seeded 25 destinations across Sri Lanka.");
    }

    private void createDestination(String name, String slug, String district, String prov, String shortDesc,
                                   String fullDesc, BigDecimal lat, BigDecimal lng, String cat, String visit,
                                   String dur, String fee, String img, BigDecimal rating, int reviews) {
        Destination d = new Destination();
        d.setName(name);
        d.setSlug(slug);
        d.setDistrict(district);
        d.setProvince(prov);
        d.setShortDescription(shortDesc);
        d.setFullDescription(fullDesc);
        d.setLatitude(lat);
        d.setLongitude(lng);
        d.setCategory(cat);
        d.setBestVisitPeriod(visit);
        d.setEstimatedVisitDuration(dur);
        d.setEntranceFeeInformation(fee);
        d.setPrimaryImageUrl(img);
        d.setAverageRating(rating);
        d.setReviewCount(reviews);
        d.setIsActive(true);
        d.addImage(new DestinationImage(img, name, 1));
        destinationRepository.save(d);
    }

    private void seedBookingsAndMaintenance() {
        if (bookingRepository.count() > 0) return;

        User user = userRepository.findByEmail("john.tourist@example.com").orElse(null);
        Vehicle vehicle2 = vehicleRepository.findById(2L).orElse(null);
        Vehicle vehicle3 = vehicleRepository.findById(3L).orElse(null);
        Vehicle vehicle4 = vehicleRepository.findById(4L).orElse(null);
        Vehicle vehicle5 = vehicleRepository.findById(5L).orElse(null);

        if (user != null && vehicle2 != null) {
            Booking b1 = new Booking();
            b1.setBookingReference("TL-2026-00101");
            b1.setUser(user);
            b1.setVehicle(vehicle2);
            b1.setStartDateTime(LocalDateTime.of(2026, 11, 10, 9, 0));
            b1.setEndDateTime(LocalDateTime.of(2026, 11, 15, 18, 0));
            b1.setTotalDays(5);
            b1.setDailyRateSnapshot(vehicle2.getDailyRate());
            b1.setSubtotal(vehicle2.getDailyRate().multiply(BigDecimal.valueOf(5)));
            b1.setAdditionalFees(BigDecimal.ZERO);
            b1.setTotalAmount(vehicle2.getDailyRate().multiply(BigDecimal.valueOf(5)));
            b1.setCurrency("LKR");
            b1.setBookingStatus("CONFIRMED");
            b1.setPaymentStatus("PAID");
            b1.setSpecialNotes("Airport pickup requested at CMB.");
            bookingRepository.save(b1);
        }

        if (user != null && vehicle3 != null) {
            Booking b2 = new Booking();
            b2.setBookingReference("TL-2026-00102");
            b2.setUser(user);
            b2.setVehicle(vehicle3);
            b2.setStartDateTime(LocalDateTime.of(2026, 9, 1, 8, 0));
            b2.setEndDateTime(LocalDateTime.of(2026, 9, 5, 20, 0));
            b2.setTotalDays(4);
            b2.setDailyRateSnapshot(vehicle3.getDailyRate());
            b2.setSubtotal(vehicle3.getDailyRate().multiply(BigDecimal.valueOf(4)));
            b2.setAdditionalFees(BigDecimal.ZERO);
            b2.setTotalAmount(vehicle3.getDailyRate().multiply(BigDecimal.valueOf(4)));
            b2.setCurrency("LKR");
            b2.setBookingStatus("COMPLETED");
            b2.setPaymentStatus("PAID");
            bookingRepository.save(b2);
        }

        if (user != null && vehicle4 != null) {
            Booking b3 = new Booking();
            b3.setBookingReference("TL-2026-00103");
            b3.setUser(user);
            b3.setVehicle(vehicle4);
            b3.setStartDateTime(LocalDateTime.of(2026, 11, 20, 10, 0));
            b3.setEndDateTime(LocalDateTime.of(2026, 11, 25, 18, 0));
            b3.setTotalDays(5);
            b3.setDailyRateSnapshot(vehicle4.getDailyRate());
            b3.setSubtotal(vehicle4.getDailyRate().multiply(BigDecimal.valueOf(5)));
            b3.setAdditionalFees(BigDecimal.ZERO);
            b3.setTotalAmount(vehicle4.getDailyRate().multiply(BigDecimal.valueOf(5)));
            b3.setCurrency("LKR");
            b3.setBookingStatus("CANCELLED");
            b3.setCancellationReason("Schedule conflict");
            b3.setPaymentStatus("REFUNDED");
            bookingRepository.save(b3);
        }

        if (vehicle5 != null && maintenanceRepository.count() == 0) {
            VehicleMaintenance vm = new VehicleMaintenance();
            vm.setVehicle(vehicle5);
            vm.setStartDateTime(LocalDateTime.of(2026, 11, 1, 8, 0));
            vm.setEndDateTime(LocalDateTime.of(2026, 11, 5, 18, 0));
            vm.setReason("Routine 40,000km scheduled service and brake inspection.");
            vm.setStatus("SCHEDULED");
            maintenanceRepository.save(vm);
        }

        // Seed Reviews
        Destination sigiriya = destinationRepository.findBySlug("sigiriya-rock-fortress").orElse(null);
        if (user != null && sigiriya != null && reviewRepository.count() == 0) {
            Review r1 = new Review();
            r1.setUser(user);
            r1.setDestination(sigiriya);
            r1.setRating(5);
            r1.setReviewText("Climbing Sigiriya at sunrise was the highlight of our trip! Truly spectacular.");
            reviewRepository.save(r1);
        }

        // Seed Favorites
        Vehicle v1 = vehicleRepository.findById(1L).orElse(null);
        if (user != null && v1 != null && favoriteRepository.count() == 0) {
            favoriteRepository.save(new Favorite(user, v1));
        }

        log.info("Seeded bookings, maintenance, reviews, and favorites.");
    }
}

