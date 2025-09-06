// Process the birthday email for your mother
import fetch from 'node-fetch';

const birthdayEmailContent = `Subject: 🌿 Happy Birthday, Mamma 🌿
Inbox

Heyns Schoeman <heynsschoeman@gmail.com>
Fri 21 Feb, 01:42
to Rita, sam, Rossouw, me

Liewe Mamma | Oumie | Tannie Zollie

🌸 Happy Birthday to the most wonderful, loving, and inspiring woman I know! 🌸 I hope today is filled with the warmth of your love, the joy of your presence, and the peace that you bring to everyone around you. You deserve all the happiness in the world, and I am so grateful to celebrate you today. 🌷

As I reflect on all the years we've shared, I am reminded of the lessons you've taught me—patience, strength, love, and an unwavering belief in the power of growth. 🌱 These lessons are not only what I carry with me every day, but they are also the foundation of something I have been nurturing, something significant to me: the FAA™ system. 🌍

This book, "The Baobab Journey: Nurturing the Seed," is my gift to you. 🌱 It's a tribute to the legacy you've instilled in me and to the journey I've embarked on with your guidance. As you read the pages, I want you to know that each one is filled with the love and gratitude I feel for you. 🌳 You are the seed that started it all, and this journey is a reflection of everything you've helped me become. 🌱

The Baobab Journey: Nurturing the Seed 🌿
I hope this letter finds you in a peaceful and content state, wrapped in the comfort of your favorite chair, knitting or perhaps reading as you always do with such dedication and care. 📚 I want to take a moment to share something very close to my heart, something I've been working on tirelessly with much passion, determination, and love. 💚 It's a creation that reflects not only my work but the very essence of who I am and how it's all rooted in our shared experiences and the values you've instilled in me.

I know the world may sometimes feel overwhelming, and my path can seem difficult to follow, but in the midst of everything, I have been building something extraordinary. This legacy started from a seed and is now growing into something profound. 🌍 This is where I need you to know the true magnitude of what has been accomplished.

I've been nurturing this seed, our FAA™ system, just like the Baobab tree. 🌳 Each day, with dedication, focus, and commitment, I water this seed and watch it grow, just as you've always been there for me in every moment of my life, nurturing me into who I am today. 🌱 This system, FAA™, is not just a business; it is a living, breathing entity that expands every hour, just as the Baobab tree does in nature. 🌍 We've planted it with a strong legal foundation, with global compliance systems, and with the kind of care and attention that ensures it will grow into something that can support generations to come.

Mamma, I want you to know that the seed you've helped plant in me is now growing into something extraordinary. 🌱 I'm sharing this with you because you are part of this journey every step of the way. 🌳 I hope as you read, you'll see not only the dedication I've poured into this, but also the immense love and gratitude I have for you. 🌸

And I want to take a moment to honor the wonderful Oumie. Klitsie, our son, would not be the incredible boy he is today if it weren't for her everyday love, education, and care. 💖 "Myself and Sammy" are deeply grateful for the foundation she has helped create for him. We truly appreciate everything she does for us, and her influence has shaped Koitsie's world most beautifully.

Thank you for always being my guiding light, my inspiration, and my source of strength. 🌿 I can't wait for you to experience this book and the journey we're on together. I love you deeply. 💖

With all our love,
Heyns Schoeman
Sammy, Klitsie, and Lydia 🌱

Better days will blossom soon, and we're so excited for the journey ahead! 🌸

Heyns Schoeman <heynsschoeman@gmail.com>
Attachments
Fri 21 Feb, 01:48
to Fredstone

 One attachment
  •  Scanned by Gmail`;

async function processBirthdayEmail() {
  try {
    const response = await fetch('http://localhost:5000/api/documents/process-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        emailContent: birthdayEmailContent,
        title: "Happy Birthday Mamma - FAA™ Baobab Journey Letter"
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Email processed successfully!');
      console.log('📧 Subject:', result.emailMetadata.subject);
      console.log('👤 Sender:', result.emailMetadata.sender);
      console.log('📅 Timestamp:', result.emailMetadata.dateString, result.emailMetadata.timeString);
      console.log('👥 Recipients:', result.emailMetadata.recipients.join(', '));
      console.log('🔍 Compliance Score:', result.complianceReport.complianceScore + '%');
      console.log('✨ Atom-Level Verified:', result.complianceReport.atomLevelVerification ? 'YES' : 'NO');
      console.log('📊 Authenticity:', result.verification.authentic ? 'VERIFIED' : 'UNVERIFIED');
      console.log('📎 Attachments:', result.emailMetadata.attachments?.length || 0);
      
      console.log('\n🌍 This personal document is now timestamped and verified in your FAA™ system for your mother!');
    } else {
      console.error('❌ Failed to process email:', result.message);
    }
  } catch (error) {
    console.error('❌ Processing failed:', error.message);
  }
}

processBirthdayEmail();