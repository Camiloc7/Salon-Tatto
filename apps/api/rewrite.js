const fs = require('fs');

let content = fs.readFileSync('c:/Users/localadmin/Documents/Git/Salon-Tatto/apps/api/src/database/seeds/blog.seed.ts', 'utf8');

content = content.replace(
  /const count = await blogRepo\.count\(\);\s+if \(count > 0\) \{\s+console\.log\('Blog posts already exist, skipping\.\.\.'\);\s+return;\s+\}/,
  "console.log('Checking for missing blog posts...');"
);

content = content.replace(
  /const (post\d+) = blogRepo\.create\(\{([\s\S]*?slug:\s*'([^']+)'[\s\S]*?)\}\);\s+await blogRepo\.save\(\1\);\s+await transRepo\.save\(\[([\s\S]*?)\]\);/g,
  (match, postVar, objContent, slug, transContent) => {
    return `const existing_${postVar} = await blogRepo.findOne({ where: { slug: '${slug}' } });
  if (!existing_${postVar}) {
    const ${postVar} = blogRepo.create({${objContent}});
    await blogRepo.save(${postVar});
    await transRepo.save([${transContent}]);
  }`;
  }
);

fs.writeFileSync('c:/Users/localadmin/Documents/Git/Salon-Tatto/apps/api/src/database/seeds/blog.seed.ts', content);
console.log('Done rewriting blog.seed.ts');
