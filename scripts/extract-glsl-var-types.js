import fs from "fs";
import path from "path";

function findGLSLFiles(dir) {
  const glslFiles = [];

  function scanDirectory(currentDir) {
    const items = fs.readdirSync(currentDir);

    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // node_modules, .git 등 제외
        if (!item.startsWith(".") && item !== "node_modules") {
          scanDirectory(fullPath);
        }
      } else if (
        item.endsWith(".glsl") ||
        item.endsWith(".vert") ||
        item.endsWith(".frag")
      ) {
        glslFiles.push(fullPath);
      }
    }
  }

  scanDirectory(dir);
  return glslFiles;
}

function extractAttributesFromGLSL(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");

    // attribute 선언을 찾는 정규식
    const attributeRegex = /attribute\s+(\w+)\s+(\w+)\s*;/g;

    const attributes = [];
    let match;

    while ((match = attributeRegex.exec(content)) !== null) {
      const type = match[1];
      const name = match[2];
      attributes.push({ name, type });
    }

    return attributes;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return [];
  }
}

function extractUniformsFromGLSL(filePath) {
  try {
  const content = fs.readFileSync(filePath, "utf8");
  const uniformRegex = /uniform\s+(\w+)\s+(\w+)\s*;/g;
  const uniforms = [];
  let match;
  
  while ((match = uniformRegex.exec(content)) !== null) {
    const type = match[1];
    const name = match[2];
      uniforms.push({ name, type });
    }
    return uniforms;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return [];
  }
}

function generateTypeScriptTypes(allAttributes, allUniforms) {
  if (allAttributes.length === 0) {
    return "// No attributes found in any GLSL files";
  }

  // 중복 제거
  const uniqueAttributes = [...new Set(allAttributes.map((attr) => attr.name))];
  const uniqueUniforms = [...new Set(allUniforms.map((uniform) => uniform.name))];

  // 유니온 타입 생성
  const unionAttributeType = uniqueAttributes.map((name) => `"${name}"`).join(" | ");
  const unionUniformType = uniqueUniforms.map((name) => `"${name}"`).join(" | ");

  // 파일별로 attribute 표시
  const fileGroups = {};

  allAttributes.forEach((attr) => {
    if (!fileGroups[attr.file]) {
      fileGroups[attr.file] = [];
    }
    fileGroups[attr.file].push(attr);
  });
  const attributeFileMap = {};
  allAttributes.forEach((attr) => {
    if (!attributeFileMap[attr.name]) {
      attributeFileMap[attr.name] = new Set();
    }
    attributeFileMap[attr.name].add(attr.file);
  });
  const uniformFileMap = {};
  allUniforms.forEach((uniform) => {
    if (!uniformFileMap[uniform.name]) {
      uniformFileMap[uniform.name] = new Set();
    }
    uniformFileMap[uniform.name].add(uniform.file);
  });

  let output = "";
  output += "// Extracted from all GLSL files in src/\n";
  output += "// Auto-generated - Do not edit manually\n";
  output += "\n";
  output += "/**\n";
  output += " * @description Each attribute and its source file(s):\n";
  uniqueAttributes.forEach((attrName) => {
    const files = Array.from(attributeFileMap[attrName]);
    const relativePaths = files.map((file) => path.relative("src", file));
    output += ` * - ${attrName}: ${relativePaths.join(", ")}\n`;
  });
  output += " */\n";
  output += `export type GLSLAttribute = ${unionAttributeType};\n`;
  output += "\n";
  output += "/**\n";
  output += " * @description Each uniform and its source file(s):\n";
  uniqueUniforms.forEach((uniformName) => {
    const files = Array.from(uniformFileMap[uniformName]);
    const relativePaths = files.map((file) => path.relative("src", file));
    output += ` * - ${uniformName}: ${relativePaths.join(", ")}\n`;
  });
  output += " */\n";
  output += `export type GLSLUniform = ${unionUniformType};\n`;

  return output;
}

function main() {
  const srcDir = path.join(process.cwd(), "src");

  if (!fs.existsSync(srcDir)) {
    console.error("Error: src directory not found");
    process.exit(1);
  }

  console.log("Scanning for GLSL files in src/...");
  const glslFiles = findGLSLFiles(srcDir);

  if (glslFiles.length === 0) {
    console.log("No GLSL files found in src/");
    process.exit(0);
  }

  console.log(`Found ${glslFiles.length} GLSL files:`);
  glslFiles.forEach((file) => {
    const relativePath = path.relative(process.cwd(), file);
    console.log(`  - ${relativePath}`);
  });
  console.log("");

  const allAttributes = [];
  const allUniforms = [];

  glslFiles.forEach((filePath) => {
    const attributes = extractAttributesFromGLSL(filePath);
    const uniforms = extractUniformsFromGLSL(filePath);
    attributes.forEach((attr) => {
      allAttributes.push({
        ...attr,
        file: filePath,
      });
    });
    uniforms.forEach((uniform) => {
      allUniforms.push({
        ...uniform,
        file: filePath,
      });
    });
  });

  // TypeScript 타입 생성
  const output = generateTypeScriptTypes(allAttributes, allUniforms);

  // src/generated/types 폴더 생성
  const generatedDir = path.join(srcDir, "generated");
  const typesDir = path.join(generatedDir, "types");

  if (!fs.existsSync(generatedDir)) {
    fs.mkdirSync(generatedDir, { recursive: true });
  }

  if (!fs.existsSync(typesDir)) {
    fs.mkdirSync(typesDir, { recursive: true });
  }

  // glsl-attr-types.ts 파일로 저장
  const outputPath = path.join(typesDir, "glsl-attr-types.ts");

  try {
    fs.writeFileSync(outputPath, output, "utf8");
    console.log(`Types saved to: ${outputPath}`);

    // 생성된 타입 개수 표시
    const uniqueCount = [...new Set(allAttributes.map((attr) => attr.name))]
      .length;
    console.log(`Generated ${uniqueCount} unique attribute types`);
  } catch (error) {
    console.error("Error saving file:", error.message);
  }
}

main();
