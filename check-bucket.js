// Script to verify userAvatar bucket configuration
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkBucket() {
  console.log('🔍 Checking userAvatar bucket configuration...\n');
  
  try {
    // List buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ Error listing buckets:', bucketsError.message);
      return;
    }
    
    console.log('📦 Available buckets:');
    buckets.forEach(bucket => {
      console.log(`   - ${bucket.name} (${bucket.public ? 'public' : 'private'})`);
    });
    
    const userAvatarBucket = buckets.find(b => b.name === 'userAvatar');
    
    if (!userAvatarBucket) {
      console.error('\n❌ Bucket "userAvatar" not found!');
      console.log('\n💡 Create the bucket in Supabase Dashboard:');
      console.log('   1. Go to Storage > New Bucket');
      console.log('   2. Name: userAvatar');
      console.log('   3. Public: Yes');
      return;
    }
    
    console.log(`\n✅ Bucket "userAvatar" found!`);
    console.log(`   - Public: ${userAvatarBucket.public ? 'Yes ✅' : 'No ❌'}`);
    console.log(`   - ID: ${userAvatarBucket.id}`);
    
    if (!userAvatarBucket.public) {
      console.log('\n⚠️  Bucket should be public for avatar access');
    }
    
    // Test file listing (should work if policies are correct)
    const { data: files, error: filesError } = await supabase.storage
      .from('userAvatar')
      .list('', { limit: 1 });
    
    if (filesError) {
      console.log('\n⚠️  List files test:', filesError.message);
    } else {
      console.log('\n✅ Bucket is accessible');
    }
    
    console.log('\n✅ Configuration looks good!');
    console.log('\n📝 Next steps:');
    console.log('   1. Make sure to run: migrations/002_configure_userAvatar_policies.sql');
    console.log('   2. Test uploading an avatar as ADMIN or WORKER');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkBucket();
