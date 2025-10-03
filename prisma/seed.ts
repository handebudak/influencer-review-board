// Prisma Seed Script - Demo Data
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create demo user
  const hashedPassword = await bcrypt.hash('password', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('✅ User created:', user.email);

  // Clear existing items and audit logs
  await prisma.auditLog.deleteMany({});
  await prisma.item.deleteMany({});
  console.log('✅ Existing items cleared');

  // Create demo rules
  const rules = [
    {
      name: 'High Amount Risk',
      description: 'Deals over $10,000 are high risk',
      condition: JSON.stringify({ field: 'amount', operator: '>', value: 10000 }),
      scoreImpact: 30,
      priority: 1,
    },
    {
      name: 'Low Engagement Risk',
      description: 'Engagement rate below 1% is risky',
      condition: JSON.stringify({ field: 'engagementRate', operator: '<', value: 1.0 }),
      scoreImpact: 20,
      priority: 2,
    },
    {
      name: 'Story Engagement Risk',
      description: 'Low story engagement rate is risky',
      condition: JSON.stringify({ field: 'storyEngagementRate', operator: '<', value: 5.0 }),
      scoreImpact: 15,
      priority: 3,
    },
  ];

  // Clear existing rules first
  await prisma.rule.deleteMany({});
  
  for (const rule of rules) {
    await prisma.rule.create({
      data: rule,
    });
  }

  console.log('✅ Rules created');

  // Create demo items
  const items = [
    {
      title: 'Nike x @fashionista_emma Deal',
      description: '3 Instagram posts + 2 stories featuring new Nike Air Max collection. Target audience: Fashion-conscious millennials. Campaign duration: 2 weeks.',
      amount: 5000,
      influencerName: 'Emma Johnson',
      influencerHandle: '@fashionista_emma',
      followers: 250000,
      engagementRate: 4.2,
      storyEngagementRate: 12.5,
      avgLikes: 8500,
      brandName: 'Nike',
      status: 'NEW' as const,
      createdById: user.id,
      createdAt: new Date(Date.now() - 45 * 60 * 1000), // 45 dakika önce
    },
    {
      title: 'HelloFresh x @foodie_sarah Collaboration',
      description: '5 Instagram reels showcasing vegan meal prep with HelloFresh. Weekly content for 1 month.',
      amount: 3500,
      influencerName: 'Sarah Martinez',
      influencerHandle: '@foodie_sarah',
      followers: 180000,
      engagementRate: 5.8,
      brandName: 'HelloFresh',
      storyEngagementRate: 15.2,
      avgLikes: 6200,
      status: 'IN_REVIEW' as const,
      createdById: user.id,
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 saat önce
    },
    {
      title: 'CryptoExchange x @crypto_bro Promotion',
      description: '10 tweets promoting new crypto exchange with referral links. Suspicious offer.',
      amount: 15000,
      influencerName: 'Brad Thompson',
      influencerHandle: '@crypto_bro',
      followers: 50000,
      engagementRate: 1.2,
      brandName: 'Unknown Crypto Exchange',
      storyEngagementRate: 8.5,
      avgLikes: 4200,
      status: 'NEW' as const,
      createdById: user.id,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 gün önce
    },
    {
      title: 'Sephora x @beauty_queen Makeup Tutorial',
      description: 'YouTube tutorial featuring Sephora products. High-quality content with detailed reviews.',
      amount: 8000,
      influencerName: 'Lisa Chen',
      influencerHandle: '@beauty_queen',
      followers: 420000,
      engagementRate: 6.5,
      brandName: 'Sephora',
      storyEngagementRate: 22.1,
      avgLikes: 12000,
      status: 'APPROVED' as const,
      createdById: user.id,
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 gün önce
    },
    {
      title: 'Unknown Brand x @micro_influencer Deal',
      description: 'Suspicious offer from unknown brand. Very high payment for low follower count.',
      amount: 12000,
      influencerName: 'John Doe',
      influencerHandle: '@micro_influencer',
      followers: 8000,
      engagementRate: 0.8,
      brandName: 'XYZ',
      storyEngagementRate: 3.2,
      avgLikes: 1800,
      status: 'REJECTED' as const,
      createdById: user.id,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 gün önce
    },
    {
      title: 'Apple x @tech_reviewer_max Partnership',
      description: 'Full review of new iPhone 16 Pro with unboxing video, hands-on testing, and camera comparison. Multi-platform content.',
      amount: 7500,
      influencerName: 'Max Anderson',
      influencerHandle: '@tech_reviewer_max',
      followers: 520000,
      engagementRate: 7.3,
      brandName: 'Apple',
      storyEngagementRate: 18.5,
      avgLikes: 9500,
      status: 'IN_REVIEW' as const,
      createdById: user.id,
      createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 dakika önce
    },
    {
      title: 'Adidas x @fitness_coach_alex Campaign',
      description: 'Weekly workout videos featuring Adidas sportswear. Focus on home fitness routines.',
      amount: 6200,
      influencerName: 'Alex Rodriguez',
      influencerHandle: '@fitness_coach_alex',
      followers: 380000,
      engagementRate: 5.4,
      brandName: 'Adidas',
      storyEngagementRate: 14.8,
      avgLikes: 7200,
      status: 'APPROVED' as const,
      createdById: user.id,
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 saat önce
    },
    {
      title: 'Spotify x @music_blogger_jenny Playlist',
      description: 'Curated playlist promotion with story takeover. Genre: Indie/Alternative.',
      amount: 2800,
      influencerName: 'Jenny Williams',
      influencerHandle: '@music_blogger_jenny',
      followers: 125000,
      engagementRate: 4.8,
      brandName: 'Spotify',
      storyEngagementRate: 11.3,
      avgLikes: 5800,
      status: 'NEW' as const,
      createdById: user.id,
      createdAt: new Date(Date.now() - 2 * 60 * 1000), // 2 dakika önce
    },
    {
      title: 'Tesla x @auto_enthusiast_mike Review',
      description: 'Test drive and detailed review of Model 3. Long-form YouTube video.',
      amount: 9500,
      influencerName: 'Mike Stevens',
      influencerHandle: '@auto_enthusiast_mike',
      followers: 610000,
      engagementRate: 6.9,
      brandName: 'Tesla',
      storyEngagementRate: 16.7,
      avgLikes: 8800,
      status: 'IN_REVIEW' as const,
      createdById: user.id,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Dün
    },
    {
      title: 'Starbucks x @coffee_lover_kate Series',
      description: 'Weekly coffee tasting series featuring seasonal drinks. Instagram & TikTok.',
      amount: 4100,
      influencerName: 'Kate Morrison',
      influencerHandle: '@coffee_lover_kate',
      followers: 215000,
      engagementRate: 5.2,
      brandName: 'Starbucks',
      storyEngagementRate: 13.4,
      avgLikes: 6400,
      status: 'APPROVED' as const,
      createdById: user.id,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 gün önce
    },
    {
      title: 'Amazon x @book_reviewer_tom Reading List',
      description: 'Monthly book recommendations with Amazon affiliate links. Blog + video content.',
      amount: 3200,
      influencerName: 'Tom Anderson',
      influencerHandle: '@book_reviewer_tom',
      followers: 95000,
      engagementRate: 4.5,
      brandName: 'Amazon',
      storyEngagementRate: 9.8,
      avgLikes: 3900,
      status: 'NEW' as const,
      createdById: user.id,
      createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 dakika önce
    },
    {
      title: 'GoPro x @adventure_seeker_luna Travel Vlog',
      description: 'Adventure travel vlog series using GoPro Hero 12. Mountain biking and hiking content.',
      amount: 7800,
      influencerName: 'Luna Parker',
      influencerHandle: '@adventure_seeker_luna',
      followers: 445000,
      engagementRate: 7.1,
      brandName: 'GoPro',
      storyEngagementRate: 19.6,
      avgLikes: 11200,
      status: 'IN_REVIEW' as const,
      createdById: user.id,
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 saat önce
    },
    {
      title: 'Samsung x @tech_daily_news Product Launch',
      description: 'Coverage of Galaxy S24 launch event with live updates and first impressions.',
      amount: 11000,
      influencerName: 'David Kim',
      influencerHandle: '@tech_daily_news',
      followers: 720000,
      engagementRate: 6.3,
      brandName: 'Samsung',
      storyEngagementRate: 12.1,
      avgLikes: 5600,
      status: 'APPROVED' as const,
      createdById: user.id,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 gün önce
    },
    {
      title: 'Zara x @style_maven_olivia Fashion Week',
      description: 'Exclusive coverage of Zara Spring Collection launch. Instagram stories + blog post.',
      amount: 4500,
      influencerName: 'Olivia Taylor',
      influencerHandle: '@style_maven_olivia',
      followers: 310000,
      engagementRate: 5.9,
      brandName: 'Zara',
      storyEngagementRate: 17.3,
      avgLikes: 9200,
      status: 'NEW' as const,
      createdById: user.id,
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 saat önce
    },
    {
      title: 'PlayStation x @gamer_boy_chris Stream',
      description: 'Live streaming new PS5 games for 10 hours. Twitch + YouTube Gaming.',
      amount: 6800,
      influencerName: 'Chris Walker',
      influencerHandle: '@gamer_boy_chris',
      followers: 485000,
      engagementRate: 8.2,
      brandName: 'PlayStation',
      storyEngagementRate: 21.4,
      avgLikes: 13500,
      status: 'IN_REVIEW' as const,
      createdById: user.id,
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 saat önce
    },
    {
      title: 'IKEA x @home_decor_bella Room Makeover',
      description: 'Complete bedroom makeover using IKEA furniture. Time-lapse video + styling tips.',
      amount: 5200,
      influencerName: 'Bella Martinez',
      influencerHandle: '@home_decor_bella',
      followers: 275000,
      engagementRate: 6.1,
      brandName: 'IKEA',
      storyEngagementRate: 15.7,
      avgLikes: 7800,
      status: 'APPROVED' as const,
      createdById: user.id,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 gün önce
    },
    {
      title: 'Gambling Site x @random_influencer Promo',
      description: 'Suspicious gambling site promotion with high commission. No brand verification.',
      amount: 18000,
      influencerName: 'Random User',
      influencerHandle: '@random_influencer',
      followers: 25000,
      engagementRate: 0.5,
      brandName: 'BetNow123',
      storyEngagementRate: 2.1,
      avgLikes: 900,
      status: 'REJECTED' as const,
      createdById: user.id,
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 gün önce
    },
    {
      title: 'H&M x @fashion_forward_mia Sustainable Line',
      description: 'Promoting H&M Conscious collection. Focus on sustainable fashion.',
      amount: 3900,
      influencerName: 'Mia Johnson',
      influencerHandle: '@fashion_forward_mia',
      followers: 195000,
      engagementRate: 5.3,
      brandName: 'H&M',
      storyEngagementRate: 14.2,
      avgLikes: 6900,
      status: 'NEW' as const,
      createdById: user.id,
      createdAt: new Date(Date.now() - 20 * 60 * 1000), // 20 dakika önce
    },
    {
      title: 'Airbnb x @travel_couple_dan_amy World Tour',
      description: 'Documenting stays at unique Airbnb properties across 10 countries.',
      amount: 12500,
      influencerName: 'Dan & Amy',
      influencerHandle: '@travel_couple_dan_amy',
      followers: 680000,
      engagementRate: 7.8,
      brandName: 'Airbnb',
      storyEngagementRate: 16.9,
      avgLikes: 8400,
      status: 'IN_REVIEW' as const,
      createdById: user.id,
      createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000), // 18 saat önce
    },
    {
      title: 'Nintendo x @retro_gamer_steve Switch Review',
      description: 'Comparing Nintendo Switch OLED with original model. Detailed gameplay footage.',
      amount: 5600,
      influencerName: 'Steve Collins',
      influencerHandle: '@retro_gamer_steve',
      followers: 340000,
      engagementRate: 6.7,
      brandName: 'Nintendo',
      storyEngagementRate: 20.3,
      avgLikes: 12800,
      status: 'APPROVED' as const,
      createdById: user.id,
      createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000), // 9 gün önce
    },
    {
      title: 'Weight Loss Pills x @fitness_fake Scam',
      description: 'Promoting fake weight loss supplements. No scientific backing.',
      amount: 22000,
      influencerName: 'Fake Account',
      influencerHandle: '@fitness_fake',
      followers: 15000,
      engagementRate: 0.3,
      brandName: 'SlimFast Pro',
      storyEngagementRate: 4.8,
      avgLikes: 2100,
      status: 'REJECTED' as const,
      createdById: user.id,
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 gün önce
    },
    {
      title: 'Canon x @photography_pro_rachel Tutorial Series',
      description: 'Professional photography tutorial series using Canon EOS R5. 5-part YouTube series.',
      amount: 8900,
      influencerName: 'Rachel Green',
      influencerHandle: '@photography_pro_rachel',
      followers: 420000,
      engagementRate: 5.8,
      brandName: 'Canon',
      storyEngagementRate: 18.7,
      avgLikes: 9800,
      status: 'NEW' as const,
      createdById: user.id,
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 saat önce
    },
    {
      title: 'Peloton x @fitness_mom_lisa Home Workout',
      description: 'Monthly workout routines for busy moms. Peloton bike + app integration.',
      amount: 7200,
      influencerName: 'Lisa Thompson',
      influencerHandle: '@fitness_mom_lisa',
      followers: 385000,
      engagementRate: 6.4,
      brandName: 'Peloton',
      storyEngagementRate: 13.6,
      avgLikes: 6100,
      status: 'IN_REVIEW' as const,
      createdById: user.id,
      createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000), // 1.5 gün önce
    },
    {
      title: 'Lego x @parent_blogger_mark Family Build',
      description: 'Family-friendly Lego building challenges. Weekly content for kids.',
      amount: 4800,
      influencerName: 'Mark Wilson',
      influencerHandle: '@parent_blogger_mark',
      followers: 220000,
      engagementRate: 7.5,
      brandName: 'Lego',
      storyEngagementRate: 11.9,
      avgLikes: 4700,
      status: 'APPROVED' as const,
      createdById: user.id,
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 gün önce
    },
    {
      title: 'Dyson x @clean_home_hannah Product Demo',
      description: 'Demonstrating Dyson V15 vacuum cleaner. Real home cleaning footage.',
      amount: 3600,
      influencerName: 'Hannah Brown',
      influencerHandle: '@clean_home_hannah',
      followers: 165000,
      engagementRate: 5.1,
      brandName: 'Dyson',
      storyEngagementRate: 10.4,
      avgLikes: 3800,
      status: 'NEW' as const,
      createdById: user.id,
      createdAt: new Date(Date.now() - 8 * 60 * 1000), // 8 dakika önce
    },
    {
      title: 'Unknown Forex x @money_guru_scam Trading Tips',
      description: 'Promoting unregistered forex trading platform. High risk of fraud.',
      amount: 25000,
      influencerName: 'Scam Account',
      influencerHandle: '@money_guru_scam',
      followers: 12000,
      engagementRate: 0.2,
      brandName: 'ForexGuru Pro',
      storyEngagementRate: 7.2,
      avgLikes: 2900,
      status: 'REJECTED' as const,
      createdById: user.id,
      createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), // 25 gün önce
    },
    {
      title: 'Patagonia x @outdoor_explorer_jake Hiking Gear',
      description: 'Testing Patagonia gear on Pacific Crest Trail. Multi-week adventure series.',
      amount: 9800,
      influencerName: 'Jake Morrison',
      influencerHandle: '@outdoor_explorer_jake',
      followers: 510000,
      engagementRate: 7.9,
      brandName: 'Patagonia',
      storyEngagementRate: 15.8,
      avgLikes: 7600,
      status: 'IN_REVIEW' as const,
      createdById: user.id,
      createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000), // 10 saat önce
    },
    {
      title: 'Disney+ x @movie_critic_sophia Review',
      description: 'Weekly Disney+ original series reviews. Focus on family content.',
      amount: 4200,
      influencerName: 'Sophia Lee',
      influencerHandle: '@movie_critic_sophia',
      followers: 290000,
      engagementRate: 6.2,
      brandName: 'Disney+',
      storyEngagementRate: 12.7,
      avgLikes: 5200,
      status: 'APPROVED' as const,
      createdById: user.id,
      createdAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000), // 11 gün önce
    },
  ];

  for (const item of items) {
    const createdItem = await prisma.item.create({
      data: item,
    });
    console.log('✅ Item created:', createdItem.title);

    // Calculate risk score for each item
    const { calculateRiskScore } = await import('../src/lib/risk-engine');
    const riskResult = calculateRiskScore({
      amount: item.amount,
      followers: item.followers,
      engagementRate: item.engagementRate,
      storyEngagementRate: item.storyEngagementRate,
      avgLikes: item.avgLikes,
      brandName: item.brandName,
    });

    await prisma.item.update({
      where: { id: createdItem.id },
      data: {
        riskScore: riskResult.score,
        riskLevel: riskResult.level,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        itemId: createdItem.id,
        userId: user.id,
        action: 'CREATED',
        changes: JSON.stringify({ created: true }),
      },
    });
  }

  console.log('✅ Demo items created with risk scores');
  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

