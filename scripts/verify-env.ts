import { config } from 'dotenv'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

config()

const expectedProjectRef = 'sjsafhcmlkkccxuchcdd'
const envPath = join(process.cwd(), '.env')

console.log('🔍 Verifying environment variables...\n')

// Read .env file
let envContent = ''
try {
  envContent = readFileSync(envPath, 'utf-8')
} catch (error) {
  console.error('❌ Could not read .env file')
  process.exit(1)
}

// Check SUPABASE_DB_URL
const dbUrlMatch = envContent.match(/SUPABASE_DB_URL=(.+)/)
if (!dbUrlMatch) {
  console.error('❌ SUPABASE_DB_URL not found in .env')
  process.exit(1)
}

const currentUrl = dbUrlMatch[1].replace(/^["']|["']$/g, '') // Remove quotes
const projectRefMatch = currentUrl.match(/@db\.([^.]+)\.supabase\.co/)

if (!projectRefMatch) {
  console.error('❌ Could not parse project reference from SUPABASE_DB_URL')
  console.log('Current URL:', currentUrl.replace(/:[^:@]+@/, ':****@'))
  process.exit(1)
}

const currentProjectRef = projectRefMatch[1]

console.log(`Current project ref: ${currentProjectRef}`)
console.log(`Expected project ref: ${expectedProjectRef}`)

if (currentProjectRef === expectedProjectRef) {
  console.log('\n✅ Project reference is correct!')
} else {
  console.log('\n⚠️  Project reference mismatch!')
  console.log('\nUpdating .env file...')
  
  // Replace the project reference in the URL
  const updatedUrl = currentUrl.replace(
    /@db\.[^.]+\.supabase\.co/,
    `@db.${expectedProjectRef}.supabase.co`
  )
  
  // Update the .env file
  const updatedContent = envContent.replace(
    /SUPABASE_DB_URL=(.+)/,
    `SUPABASE_DB_URL="${updatedUrl}"`
  )
  
  writeFileSync(envPath, updatedContent, 'utf-8')
  console.log('✅ Updated SUPABASE_DB_URL in .env file')
  console.log(`New URL: ${updatedUrl.replace(/:[^:@]+@/, ':****@')}`)
}

// Check other required variables
console.log('\n📋 Checking other required variables:')

const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY'
]

let allPresent = true
for (const varName of requiredVars) {
  const match = envContent.match(new RegExp(`${varName}=(.+)`))
  if (match) {
    const value = match[1].replace(/^["']|["']$/g, '')
    if (value.includes(expectedProjectRef) || varName.includes('KEY')) {
      console.log(`  ✅ ${varName}`)
    } else if (varName.includes('URL')) {
      console.log(`  ⚠️  ${varName} - check project ref`)
    } else {
      console.log(`  ✅ ${varName}`)
    }
  } else {
    console.log(`  ❌ ${varName} - MISSING`)
    allPresent = false
  }
}

if (!allPresent) {
  console.log('\n⚠️  Some required variables are missing')
}

console.log('\n✨ Verification complete!')

