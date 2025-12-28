#!/usr/bin/env node

/**
 * cursor-full-flow CLI
 * End-to-End Development Workflow for Cursor IDE
 * Jira → Code → PR automation with AI assistance
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const VERSION = '1.0.0';
const CURSOR_DIR = '.cursor';
const COMMANDS_DIR = 'commands';

// Colors for terminal output
const colors = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
};

const log = {
    info: (msg) => console.log(`${colors.cyan}ℹ${colors.reset} ${msg}`),
    success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
    warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
    error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
    step: (msg) => console.log(`  ${colors.dim}→${colors.reset} ${msg}`),
    header: (msg) => console.log(`\n${colors.bold}${colors.cyan}${msg}${colors.reset}\n`),
};

// Command bundles
const BUNDLES = {
    minimal: {
        name: 'Minimal (Core Workflow)',
        description: 'Essential workflow commands only',
        commands: ['workflow'],
        count: 5,
    },
    standard: {
        name: 'Standard (Workflow + Jira)',
        description: 'Workflow automation with Jira integration',
        commands: ['workflow', 'jira'],
        count: 11,
    },
    complete: {
        name: 'Complete (All Commands)',
        description: 'Full suite including PR and analysis tools',
        commands: ['workflow', 'jira', 'pr', 'analysis'],
        count: 22,
    },
};

// MCP configurations
const MCP_CONFIGS = {
    github: {
        name: 'GitHub',
        icon: '🐙',
        description: 'PR management, CI status, code review',
        required: true,
        package: '@modelcontextprotocol/server-github',
        envVars: ['GITHUB_PERSONAL_ACCESS_TOKEN'],
        guide: {
            title: 'Get GitHub Personal Access Token',
            steps: [
                '1. Go to: https://github.com/settings/tokens',
                '2. Click "Generate new token (classic)"',
                '3. Select scopes: repo, read:org, read:user, workflow',
                '4. Copy the token (starts with ghp_)',
            ],
            url: 'https://github.com/settings/tokens',
        },
    },
    jira: {
        name: 'Jira/Atlassian',
        icon: '📋',
        description: 'Ticket fetching, branch naming, test instructions',
        required: true,
        package: '@aashari/mcp-server-atlassian-jira',
        envVars: ['ATLASSIAN_SITE_NAME', 'ATLASSIAN_USER_EMAIL', 'ATLASSIAN_API_TOKEN'],
        guide: {
            title: 'Get Atlassian API Token',
            steps: [
                '1. Go to: https://id.atlassian.com/manage-profile/security/api-tokens',
                '2. Click "Create API token"',
                '3. Label it (e.g., "Cursor Full-Flow")',
                '4. Copy the token',
                '5. Site name is your Jira subdomain (e.g., "your-company" from your-company.atlassian.net)',
            ],
            url: 'https://id.atlassian.com/manage-profile/security/api-tokens',
        },
    },
};

// Helper to prompt user
function prompt(question, defaultValue = '') {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const defaultText = defaultValue ? ` (${defaultValue})` : '';

    return new Promise((resolve) => {
        rl.question(`${question}${defaultText}: `, (answer) => {
            rl.close();
            resolve(answer || defaultValue);
        });
    });
}

// Ensure directory exists
function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

// Copy commands from package to project
function copyCommands(sourceDir, targetDir, categories) {
    let copiedCount = 0;

    categories.forEach((category) => {
        const srcCategoryDir = path.join(sourceDir, category);
        const tgtCategoryDir = targetDir;

        if (fs.existsSync(srcCategoryDir)) {
            const files = fs.readdirSync(srcCategoryDir).filter((f) => f.endsWith('.md'));

            files.forEach((file) => {
                const srcFile = path.join(srcCategoryDir, file);
                const tgtFile = path.join(tgtCategoryDir, file);

                if (!fs.existsSync(tgtFile)) {
                    fs.copyFileSync(srcFile, tgtFile);
                    log.step(`Installed: ${file}`);
                    copiedCount++;
                } else {
                    log.step(`Exists: ${file} (skipped)`);
                }
            });
        }
    });

    return copiedCount;
}

// Detect existing MCP config
function detectExistingMcp() {
    const globalMcpPath = path.join(require('os').homedir(), '.cursor', 'mcp.json');

    if (fs.existsSync(globalMcpPath)) {
        try {
            const config = JSON.parse(fs.readFileSync(globalMcpPath, 'utf8'));
            return config.mcpServers || {};
        } catch {
            return {};
        }
    }
    return {};
}

// MCP setup wizard
async function mcpSetupWizard() {
    log.header('📡 MCP Configuration');
    console.log('Full-Flow requires GitHub and Jira MCPs for complete automation.\n');

    const existingMcp = detectExistingMcp();
    const mcpSetup = {};

    for (const [key, config] of Object.entries(MCP_CONFIGS)) {
        console.log(`\n${config.icon} ${colors.bold}${config.name}${colors.reset}`);
        console.log(`   ${config.description}`);

        // Check if already configured
        if (existingMcp[key]) {
            log.success(`   Already configured in ~/.cursor/mcp.json`);
            mcpSetup[key] = { enabled: true, existing: true };
            continue;
        }

        const required = config.required ? `${colors.yellow}(required)${colors.reset}` : '';
        const answer = await prompt(`   Configure ${config.name}? ${required} (Y/n)`, 'y');

        if (answer.toLowerCase() === 'y') {
            mcpSetup[key] = { enabled: true, env: {} };

            // Show guide
            console.log(`\n   ${colors.bold}Guide: ${config.guide.title}${colors.reset}`);
            config.guide.steps.forEach((step) => console.log(`   ${step}`));
            console.log(`   ${colors.cyan}More info: ${config.guide.url}${colors.reset}\n`);

            // Collect env vars
            for (const envVar of config.envVars) {
                const value = await prompt(`     ${envVar}`);
                if (value) {
                    mcpSetup[key].env[envVar] = value;
                }
            }

            if (Object.keys(mcpSetup[key].env).length === config.envVars.length) {
                log.success(`   ${config.name} configured`);
            } else {
                log.warn(`   ${config.name} partially configured`);
            }
        } else {
            mcpSetup[key] = { enabled: false };
            if (config.required) {
                log.warn(`   Skipped ${config.name} - some commands may not work`);
            }
        }
    }

    return mcpSetup;
}

// Create MCP config file
function createMcpConfig(targetDir, mcpSetup) {
    const mcpPath = path.join(targetDir, '..', 'mcp.json'); // .cursor/mcp.json

    let config = {};
    if (fs.existsSync(mcpPath)) {
        try {
            config = JSON.parse(fs.readFileSync(mcpPath, 'utf8'));
        } catch {
            config = { mcpServers: {} };
        }
    } else {
        config = { mcpServers: {} };
    }

    Object.entries(mcpSetup).forEach(([key, setup]) => {
        if (setup.enabled && !setup.existing && setup.env) {
            const mcpConfig = MCP_CONFIGS[key];
            config.mcpServers[key] = {
                command: 'npx',
                args: ['-y', mcpConfig.package],
                env: setup.env,
            };
        }
    });

    fs.writeFileSync(mcpPath, JSON.stringify(config, null, 2));
    return true;
}

// Main init function
async function init(flags = {}) {
    console.log(`
${colors.bold}${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 CURSOR FULL-FLOW v${VERSION}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}
End-to-End Development Workflow: Jira → Code → PR

`);

    const projectDir = process.cwd();
    const cursorDir = path.join(projectDir, CURSOR_DIR);
    const commandsDir = path.join(cursorDir, COMMANDS_DIR);

    // Bundle selection
    log.header('📦 Select Command Bundle');

    Object.entries(BUNDLES).forEach(([key, bundle], idx) => {
        console.log(`  ${idx + 1}. ${colors.bold}${bundle.name}${colors.reset}`);
        console.log(`     ${bundle.description} (${bundle.count} commands)\n`);
    });

    let selectedBundle = 'complete';
    if (!flags.bundle && !flags.yes) {
        const bundleAnswer = await prompt('Select bundle (1-3)', '3');
        selectedBundle = Object.keys(BUNDLES)[parseInt(bundleAnswer, 10) - 1] || 'complete';
    } else if (flags.bundle) {
        selectedBundle = flags.bundle;
    }

    const bundle = BUNDLES[selectedBundle];
    log.success(`Selected: ${bundle.name}`);

    // MCP Configuration
    let mcpConfigured = 0;
    if (!flags.skipMcp && !flags.yes) {
        const mcpSetup = await mcpSetupWizard();
        mcpConfigured = Object.values(mcpSetup).filter((s) => s.enabled).length;

        if (mcpConfigured > 0) {
            ensureDir(commandsDir);
            createMcpConfig(commandsDir, mcpSetup);
        }
    }

    // Install commands
    log.header('📥 Installing Commands');

    ensureDir(commandsDir);

    // Find package commands directory
    const packageDir = path.dirname(__dirname);
    const packageCommandsDir = path.join(packageDir, 'commands');

    const copiedCount = copyCommands(packageCommandsDir, commandsDir, bundle.commands);

    // Summary
    console.log(`
${colors.bold}${colors.green}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ INSTALLATION COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}

${colors.cyan}Commands installed:${colors.reset} ${copiedCount}
${colors.cyan}MCPs configured:${colors.reset}   ${mcpConfigured}
${colors.cyan}Location:${colors.reset}          ${commandsDir}

${colors.bold}Get Started:${colors.reset}

  ${colors.cyan}/full-flow RBW-1234${colors.reset}      Complete Jira → PR workflow
  ${colors.cyan}/jira-fetch RBW-1234${colors.reset}    Fetch ticket context
  ${colors.cyan}/pr-review 12345${colors.reset}        Review a PR
  ${colors.cyan}/plan-and-budget${colors.reset}        Scope planning with file budget

${colors.bold}Command Categories:${colors.reset}
`);

    bundle.commands.forEach((cat) => {
        const icons = { workflow: '🔄', jira: '📋', pr: '🔍', analysis: '📈' };
        console.log(`  ${icons[cat] || '📁'} ${cat}: /full-flow, /gather-context, etc.`);
    });

    console.log(`
${colors.dim}Documentation: https://github.com/sharath317/cursor-full-flow${colors.reset}
`);
}

// Status command
async function status() {
    const projectDir = process.cwd();
    const commandsDir = path.join(projectDir, CURSOR_DIR, COMMANDS_DIR);

    if (!fs.existsSync(commandsDir)) {
        log.warn('Full-Flow not installed. Run: npx cursor-full-flow');
        process.exit(0);
    }

    const commands = fs.readdirSync(commandsDir).filter((f) => f.endsWith('.md'));
    const existingMcp = detectExistingMcp();

    console.log(`
${colors.bold}${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 FULL-FLOW STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}

${colors.cyan}Version:${colors.reset}  ${VERSION}
${colors.cyan}Commands:${colors.reset} ${commands.length} installed
${colors.cyan}Location:${colors.reset} ${commandsDir}

${colors.bold}Installed Commands:${colors.reset}`);

    commands.forEach((cmd) => {
        console.log(`  - /${cmd.replace('.md', '')}`);
    });

    console.log(`\n${colors.bold}MCPs Configured (${Object.keys(existingMcp).length}):${colors.reset}`);

    Object.keys(existingMcp).forEach((key) => {
        const config = MCP_CONFIGS[key];
        const icon = config?.icon || '🔌';
        const name = config?.name || key;
        console.log(`  ${icon} ${name}: ${colors.green}✓ Active${colors.reset}`);
    });

    console.log('');
}

// List commands
async function listCommands() {
    const packageDir = path.dirname(__dirname);
    const packageCommandsDir = path.join(packageDir, 'commands');

    console.log(`
${colors.bold}${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 AVAILABLE COMMANDS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}
`);

    const categories = ['workflow', 'jira', 'pr', 'analysis'];
    const icons = { workflow: '🔄', jira: '📋', pr: '🔍', analysis: '📈' };

    categories.forEach((cat) => {
        const catDir = path.join(packageCommandsDir, cat);
        if (fs.existsSync(catDir)) {
            console.log(`\n${icons[cat]} ${colors.bold}${cat.toUpperCase()}${colors.reset}`);

            const files = fs.readdirSync(catDir).filter((f) => f.endsWith('.md'));
            files.forEach((file) => {
                const name = file.replace('.md', '');
                console.log(`  /${name}`);
            });
        }
    });

    console.log('');
}

// Show help
function showHelp() {
    console.log(`
${colors.bold}cursor-full-flow v${VERSION}${colors.reset}

End-to-End Development Workflow for Cursor IDE

${colors.bold}Usage:${colors.reset}
  npx cursor-full-flow [command] [options]

${colors.bold}Commands:${colors.reset}
  init          Install commands (default)
  status        Show current configuration
  list          List all available commands
  help          Show this help

${colors.bold}Options:${colors.reset}
  --bundle      Select bundle (minimal, standard, complete)
  --skip-mcp    Skip MCP configuration
  -y, --yes     Non-interactive mode

${colors.bold}Examples:${colors.reset}
  npx cursor-full-flow                    Interactive install
  npx cursor-full-flow --bundle complete  Install all commands
  npx cursor-full-flow status             Check installation

${colors.bold}After Installation:${colors.reset}
  /full-flow RBW-1234     Complete Jira → PR workflow
  /jira-fetch RBW-1234    Fetch ticket context
  /pr-review 12345        Review a PR

${colors.dim}https://github.com/sharath317/cursor-full-flow${colors.reset}
`);
}

// Parse CLI arguments
const args = process.argv.slice(2);
const flags = {};
let command = null;

args.forEach((arg, idx) => {
    if (arg === '-y' || arg === '--yes') {
        flags.yes = true;
    } else if (arg === '--skip-mcp') {
        flags.skipMcp = true;
    } else if (arg === '--bundle' && args[idx + 1]) {
        flags.bundle = args[idx + 1];
    } else if (!arg.startsWith('-') && !command) {
        command = arg;
    }
});

// Execute command
switch (command) {
    case 'init':
    case undefined:
        init(flags);
        break;
    case 'status':
        status();
        break;
    case 'list':
        listCommands();
        break;
    case 'help':
    case '-h':
    case '--help':
        showHelp();
        break;
    default:
        log.error(`Unknown command: ${command}`);
        console.log('Run "npx cursor-full-flow help" for usage');
        process.exit(1);
}
