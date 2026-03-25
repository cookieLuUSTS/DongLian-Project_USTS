// 生成随机地理位置（北京附近）
function generateLocation() {
  const baseLat = 39.9042;
  const baseLng = 116.4074;
  const randomLat = baseLat + (Math.random() - 0.5) * 0.1;
  const randomLng = baseLng + (Math.random() - 0.5) * 0.1;
  return {
    type: 'Point',
    coordinates: [randomLng, randomLat]
  };
}

// 运动类型
const sports = ['basketball', 'football', 'badminton', 'tennis', 'swimming', 'gym'];

// 水平等级
const levels = ['beginner', 'intermediate', 'advanced'];

// 标签
const tags = ['团队合作', '技术流', '速度型', '力量型', '耐力型', '灵活性', '精准度', '战术意识', '防守专家', '进攻核心'];

// 需求
const needs = ['寻找队友', '提高技术', '参加比赛', '日常锻炼', '专业训练', '友谊赛', '减肥健身', '增强体质'];

// 名字列表
const firstNames = ['张', '王', '李', '赵', '刘', '陈', '杨', '黄', '周', '吴'];
const secondNames = ['明', '华', '强', '芳', '军', '磊', '艳', '杰', '静', '丽'];

// 生成随机运动员
function generateAthlete(index) {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const secondName = secondNames[Math.floor(Math.random() * secondNames.length)];
  const username = `${firstName}${secondName}${index}`;
  const email = `${username}@example.com`;
  
  // 随机选择1-3种运动
  const selectedSports = [];
  const sportCount = Math.floor(Math.random() * 3) + 1;
  for (let i = 0; i < sportCount; i++) {
    const sport = sports[Math.floor(Math.random() * sports.length)];
    if (!selectedSports.includes(sport)) {
      selectedSports.push(sport);
    }
  }
  
  // 随机选择2-4个标签
  const selectedTags = [];
  const tagCount = Math.floor(Math.random() * 3) + 2;
  for (let i = 0; i < tagCount; i++) {
    const tag = tags[Math.floor(Math.random() * tags.length)];
    if (!selectedTags.includes(tag)) {
      selectedTags.push(tag);
    }
  }
  
  // 随机选择1-2个需求
  const selectedNeeds = [];
  const needCount = Math.floor(Math.random() * 2) + 1;
  for (let i = 0; i < needCount; i++) {
    const need = needs[Math.floor(Math.random() * needs.length)];
    if (!selectedNeeds.includes(need)) {
      selectedNeeds.push(need);
    }
  }
  
  return {
    username,
    email,
    password: '123456', // 默认密码
    avatar: `https://via.placeholder.com/150?text=${username}`,
    bio: `我是${username}，喜欢${selectedSports.join('、')}。${selectedTags.join('、')}。${selectedNeeds.join('、')}。`,
    sports: selectedSports,
    location: generateLocation(),
    level: levels[Math.floor(Math.random() * levels.length)],
    tags: selectedTags,
    needs: selectedNeeds
  };
}

// 生成20个运动员
function generateAthletes() {
  console.log('开始生成运动员数据...');
  
  const athletes = [];
  for (let i = 1; i <= 20; i++) {
    const athlete = generateAthlete(i);
    athletes.push(athlete);
    console.log(`生成运动员 ${i}: ${athlete.username}`);
  }
  
  // 输出到文件
  const fs = require('fs');
  const outputPath = './athletes-data.json';
  fs.writeFileSync(outputPath, JSON.stringify(athletes, null, 2));
  
  console.log(`运动员数据生成完成！数据已保存到 ${outputPath}`);
  console.log('\n生成的运动员数据：');
  console.log(JSON.stringify(athletes, null, 2));
}

generateAthletes();
