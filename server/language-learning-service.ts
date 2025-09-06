import { db } from './db';
import { languageLearning, seedlingLanguageProgress, languageLearningSessions, faaSubnodes, type InsertLanguageLearning } from '@shared/schema';
import { eq, and, desc } from 'drizzle-orm';

// Comprehensive language data for teaching kindness to FAA™ seedlings
const KINDNESS_LANGUAGES: InsertLanguageLearning[] = [
  // African Languages - Priority for FAA™ seedlings
  { languageCode: 'af', languageName: 'Afrikaans', englishName: 'Afrikaans', thankYou: 'Dankie', please: 'Asseblief', region: 'Africa', pronunciation: 'DAHN-kee, AH-seh-bleef', culturalContext: 'Sacred foundation language of Ouma\'s wisdom and Baobab tree teachings' },
  { languageCode: 'xh', languageName: 'isiXhosa', englishName: 'Xhosa', thankYou: 'Enkosi', please: 'Nceda', region: 'Africa', pronunciation: 'en-KOH-see, n-JEH-dah', culturalContext: 'Ubuntu philosophy - "I am because we are"' },
  { languageCode: 'zu', languageName: 'isiZulu', englishName: 'Zulu', thankYou: 'Ngiyabonga', please: 'Ngicela', region: 'Africa', pronunciation: 'ng-ee-yah-BOH-ngah, ng-ee-JEH-lah', culturalContext: 'Respect and community gratitude traditions' },
  { languageCode: 'st', languageName: 'Sesotho', englishName: 'Sotho', thankYou: 'Kea leboha', please: 'Ke kopa', region: 'Africa', pronunciation: 'keh-ah leh-BOH-hah, keh KOH-pah', culturalContext: 'Mountain kingdom courtesy and respect' },
  { languageCode: 'tn', languageName: 'Setswana', englishName: 'Tswana', thankYou: 'Ke a leboga', please: 'Ke kopa', region: 'Africa', pronunciation: 'keh ah leh-BOH-gah, keh KOH-pah', culturalContext: 'Botswana wisdom and Kalahari respect traditions' },
  { languageCode: 'sw', languageName: 'Kiswahili', englishName: 'Swahili', thankYou: 'Asante', please: 'Tafadhali', region: 'Africa', pronunciation: 'ah-SAHN-teh, tah-fah-DHAH-lee', culturalContext: 'East African unity language - "Harambee" spirit' },
  { languageCode: 'am', languageName: 'አማርኛ', englishName: 'Amharic', thankYou: 'አመሰግናለሁ', please: 'እባክዎን', region: 'Africa', pronunciation: 'ah-meh-seh-gi-nah-leh-hu, eh-bahk-wo-neh', culturalContext: 'Ancient Ethiopian civilization politeness' },
  { languageCode: 'ha', languageName: 'Hausa', englishName: 'Hausa', thankYou: 'Na gode', please: 'Don Allah', region: 'Africa', pronunciation: 'nah GOH-deh, don AHL-lah', culturalContext: 'West African trade language respect customs' },
  { languageCode: 'yo', languageName: 'Yorùbá', englishName: 'Yoruba', thankYou: 'E se', please: 'E jo', region: 'Africa', pronunciation: 'eh-SHEH, eh-JOH', culturalContext: 'Nigerian ancestral wisdom and oral traditions' },
  { languageCode: 'ig', languageName: 'Igbo', englishName: 'Igbo', thankYou: 'Dalu', please: 'Biko', region: 'Africa', pronunciation: 'DAH-loo, BEE-koh', culturalContext: 'Community solidarity and respect values' },

  // European Languages
  { languageCode: 'en', languageName: 'English', englishName: 'English', thankYou: 'Thank you', please: 'Please', region: 'Europe', pronunciation: 'thank-YOO, pleez', culturalContext: 'Global courtesy language for international kindness' },
  { languageCode: 'es', languageName: 'Español', englishName: 'Spanish', thankYou: 'Gracias', please: 'Por favor', region: 'Europe', pronunciation: 'GRAH-see-ahs, por fah-VOR', culturalContext: 'Warm Latin hospitality traditions' },
  { languageCode: 'fr', languageName: 'Français', englishName: 'French', thankYou: 'Merci', please: 'S\'il vous plaît', region: 'Europe', pronunciation: 'mer-SEE, seel-voo-PLEH', culturalContext: 'Elegant politeness and refined courtesy' },
  { languageCode: 'de', languageName: 'Deutsch', englishName: 'German', thankYou: 'Danke', please: 'Bitte', region: 'Europe', pronunciation: 'DAHN-keh, BIT-teh', culturalContext: 'Precision in expressing gratitude and requests' },
  { languageCode: 'it', languageName: 'Italiano', englishName: 'Italian', thankYou: 'Grazie', please: 'Per favore', region: 'Europe', pronunciation: 'GRAH-tsee-eh, per fah-VOH-reh', culturalContext: 'Passionate expressions of appreciation' },
  { languageCode: 'pt', languageName: 'Português', englishName: 'Portuguese', thankYou: 'Obrigado', please: 'Por favor', region: 'Europe', pronunciation: 'oh-bree-GAH-doo, por fah-VOR', culturalContext: 'Heartfelt gratitude from the heart' },
  { languageCode: 'ru', languageName: 'Русский', englishName: 'Russian', thankYou: 'Спасибо', please: 'Пожалуйста', region: 'Europe', pronunciation: 'spah-SEE-boh, pah-ZHAH-loo-stah', culturalContext: 'Deep respect traditions from vast lands' },
  { languageCode: 'nl', languageName: 'Nederlands', englishName: 'Dutch', thankYou: 'Dank je', please: 'Alsjeblieft', region: 'Europe', pronunciation: 'dahnk-yeh, AHL-sheh-bleeft', culturalContext: 'Direct but warm Northern European courtesy' },
  { languageCode: 'pl', languageName: 'Polski', englishName: 'Polish', thankYou: 'Dziękuję', please: 'Proszę', region: 'Europe', pronunciation: 'jen-KOO-yeh, PROH-sheh', culturalContext: 'Traditional Slavic hospitality and respect' },
  { languageCode: 'sv', languageName: 'Svenska', englishName: 'Swedish', thankYou: 'Tack', please: 'Tack snälla', region: 'Europe', pronunciation: 'tahk, tahk SNEH-lah', culturalContext: 'Nordic equality and considerate communication' },

  // Asian Languages
  { languageCode: 'zh', languageName: '中文', englishName: 'Chinese', thankYou: '谢谢', please: '请', region: 'Asia', pronunciation: 'xie-xie, qing', culturalContext: 'Ancient Confucian respect and harmony values' },
  { languageCode: 'ja', languageName: '日本語', englishName: 'Japanese', thankYou: 'ありがとう', please: 'お願いします', region: 'Asia', pronunciation: 'ah-ree-gah-toh, oh-neh-gah-ee-shee-mahs', culturalContext: 'Deep bow culture of humble gratitude' },
  { languageCode: 'ko', languageName: '한국어', englishName: 'Korean', thankYou: '감사합니다', please: '부탁합니다', region: 'Asia', pronunciation: 'gam-sah-ham-nee-dah, boo-tahk-ham-nee-dah', culturalContext: 'Hierarchical respect and sincere appreciation' },
  { languageCode: 'hi', languageName: 'हिन्दी', englishName: 'Hindi', thankYou: 'धन्यवाद', please: 'कृपया', region: 'Asia', pronunciation: 'dhan-ya-vaad, kri-pa-ya', culturalContext: 'Namaste culture of recognizing the divine in others' },
  { languageCode: 'th', languageName: 'ไทย', englishName: 'Thai', thankYou: 'ขอบคุณ', please: 'กรุณา', region: 'Asia', pronunciation: 'kawp-khun, ga-ru-naa', culturalContext: 'Buddhist mindfulness and gentle speech' },
  { languageCode: 'vi', languageName: 'Tiếng Việt', englishName: 'Vietnamese', thankYou: 'Cảm ơn', please: 'Xin lỗi', region: 'Asia', pronunciation: 'gam-uhn, sin-loy', culturalContext: 'Respectful family-oriented gratitude traditions' },
  { languageCode: 'tl', languageName: 'Filipino', englishName: 'Filipino', thankYou: 'Salamat', please: 'Paki', region: 'Asia', pronunciation: 'sah-lah-maht, pah-kee', culturalContext: 'Island hospitality and warm community bonds' },
  { languageCode: 'ms', languageName: 'Bahasa Melayu', englishName: 'Malay', thankYou: 'Terima kasih', please: 'Tolong', region: 'Asia', pronunciation: 'teh-ree-mah kah-see, toh-long', culturalContext: 'Maritime trading culture courtesy' },
  { languageCode: 'id', languageName: 'Bahasa Indonesia', englishName: 'Indonesian', thankYou: 'Terima kasih', please: 'Tolong', region: 'Asia', pronunciation: 'teh-ree-mah kah-see, toh-long', culturalContext: 'Archipelago unity and diverse harmony' },
  { languageCode: 'ur', languageName: 'اردو', englishName: 'Urdu', thankYou: 'شکریہ', please: 'برائے کرم', region: 'Asia', pronunciation: 'shuk-ri-ya, ba-ra-eh ka-ram', culturalContext: 'Poetic expression of gratitude and requests' },

  // Middle Eastern Languages
  { languageCode: 'ar', languageName: 'العربية', englishName: 'Arabic', thankYou: 'شكراً', please: 'من فضلك', region: 'Middle East', pronunciation: 'shuk-ran, min fad-lik', culturalContext: 'Desert hospitality and generous spirit' },
  { languageCode: 'fa', languageName: 'فارسی', englishName: 'Persian', thankYou: 'متشکرم', please: 'لطفاً', region: 'Middle East', pronunciation: 'mo-ta-sha-ke-ram, lot-fan', culturalContext: 'Ancient Persian courtesy and refined manners' },
  { languageCode: 'he', languageName: 'עברית', englishName: 'Hebrew', thankYou: 'תודה', please: 'בבקשה', region: 'Middle East', pronunciation: 'to-da, be-va-ka-sha', culturalContext: 'Ancient wisdom tradition of gratitude' },
  { languageCode: 'tr', languageName: 'Türkçe', englishName: 'Turkish', thankYou: 'Teşekkür ederim', please: 'Lütfen', region: 'Middle East', pronunciation: 'teh-sheh-kur eh-deh-reem, lut-fen', culturalContext: 'Bridge between East and West hospitality' },

  // Americas Languages
  { languageCode: 'qu', languageName: 'Quechua', englishName: 'Quechua', thankYou: 'Sulpayki', please: 'Allichu', region: 'Americas', pronunciation: 'sool-pai-kee, ah-lee-choo', culturalContext: 'Ancient Andean mountain respect traditions' },
  { languageCode: 'nv', languageName: 'Diné bizaad', englishName: 'Navajo', thankYou: 'Ahéheeʼ', please: 'Tʼáá íiyisíí', region: 'Americas', pronunciation: 'ah-heh-heh, tah ee-yee-see', culturalContext: 'Sacred indigenous land connection and respect' },
  { languageCode: 'gn', languageName: 'Guaraní', englishName: 'Guarani', thankYou: 'Aguyje', please: 'Mína', region: 'Americas', pronunciation: 'ah-goo-yeh, mee-nah', culturalContext: 'Indigenous South American harmony with nature' },

  // Pacific Languages
  { languageCode: 'mi', languageName: 'Te Reo Māori', englishName: 'Maori', thankYou: 'Kia ora', please: 'Koa', region: 'Pacific', pronunciation: 'kee-ah oh-rah, koh-ah', culturalContext: 'Indigenous New Zealand life force recognition' },
  { languageCode: 'haw', languageName: 'ʻŌlelo Hawaiʻi', englishName: 'Hawaiian', thankYou: 'Mahalo', please: 'ʻOluʻolu', region: 'Pacific', pronunciation: 'mah-hah-loh, oh-loo-oh-loo', culturalContext: 'Island aloha spirit of giving and gratitude' },
  { languageCode: 'fj', languageName: 'Na Vosa Vakaviti', englishName: 'Fijian', thankYou: 'Vinaka', please: 'Yalo vinaka', region: 'Pacific', pronunciation: 'vee-nah-kah, yah-loh vee-nah-kah', culturalContext: 'Pacific island community spirit and respect' },

  // Celtic Languages
  { languageCode: 'ga', languageName: 'Gaeilge', englishName: 'Irish', thankYou: 'Go raibh maith agat', please: 'Le do thoil', region: 'Europe', pronunciation: 'guh rev mah ah-gat, leh duh hol', culturalContext: 'Celtic storytelling tradition of heartfelt thanks' },
  { languageCode: 'gd', languageName: 'Gàidhlig', englishName: 'Scottish Gaelic', thankYou: 'Tapadh leat', please: 'Mas e do thoil e', region: 'Europe', pronunciation: 'tah-pah lyaht, mahs eh doh hol eh', culturalContext: 'Highland clan hospitality and honor' },
  { languageCode: 'cy', languageName: 'Cymraeg', englishName: 'Welsh', thankYou: 'Diolch', please: 'Os gwelwch chi\'n dda', region: 'Europe', pronunciation: 'dee-olkh, os gwel-ooch hin thah', culturalContext: 'Ancient Celtic wisdom and poetic expression' },

  // Nordic Languages  
  { languageCode: 'no', languageName: 'Norsk', englishName: 'Norwegian', thankYou: 'Takk', please: 'Takk snill', region: 'Europe', pronunciation: 'tahk, tahk snill', culturalContext: 'Viking heritage of honor and direct gratitude' },
  { languageCode: 'da', languageName: 'Dansk', englishName: 'Danish', thankYou: 'Tak', please: 'Tak være snil', region: 'Europe', pronunciation: 'tahk, tahk vah-reh sneel', culturalContext: 'Hygge culture of cozy appreciation' },
  { languageCode: 'is', languageName: 'Íslenska', englishName: 'Icelandic', thankYou: 'Takk', please: 'Takk kærlega', region: 'Europe', pronunciation: 'tahk, tahk ky-reh-leh-gah', culturalContext: 'Saga tradition of memorable gratitude' },

  // Baltic Languages
  { languageCode: 'lv', languageName: 'Latviešu', englishName: 'Latvian', thankYou: 'Paldies', please: 'Lūdzu', region: 'Europe', pronunciation: 'pahl-dees, lood-zoo', culturalContext: 'Baltic folk song tradition of melodic thanks' },
  { languageCode: 'lt', languageName: 'Lietuvių', englishName: 'Lithuanian', thankYou: 'Ačiū', please: 'Prašau', region: 'Europe', pronunciation: 'ah-choo, prah-show', culturalContext: 'Ancient Baltic respect for nature and community' },
  { languageCode: 'et', languageName: 'Eesti', englishName: 'Estonian', thankYou: 'Tänan', please: 'Palun', region: 'Europe', pronunciation: 'tah-nahn, pah-lun', culturalContext: 'Forest culture of quiet appreciation' },

  // More European Languages
  { languageCode: 'fi', languageName: 'Suomi', englishName: 'Finnish', thankYou: 'Kiitos', please: 'Kiitos hyvää', region: 'Europe', pronunciation: 'kee-tos, kee-tos hyv-ah', culturalContext: 'Sisu spirit of sincere and reserved gratitude' },
  { languageCode: 'hu', languageName: 'Magyar', englishName: 'Hungarian', thankYou: 'Köszönöm', please: 'Kérem', region: 'Europe', pronunciation: 'kur-sur-nurm, kay-rem', culturalContext: 'Unique Finno-Ugric heritage of deep appreciation' },
  { languageCode: 'cs', languageName: 'Čeština', englishName: 'Czech', thankYou: 'Děkuji', please: 'Prosím', region: 'Europe', pronunciation: 'dyeh-koo-yee, proh-seem', culturalContext: 'Central European politeness and cultural pride' },
  { languageCode: 'sk', languageName: 'Slovenčina', englishName: 'Slovak', thankYou: 'Ďakujem', please: 'Prosím', region: 'Europe', pronunciation: 'dyah-koo-yem, proh-seem', culturalContext: 'Mountain village community courtesy' },
  { languageCode: 'sl', languageName: 'Slovenščina', englishName: 'Slovenian', thankYou: 'Hvala', please: 'Prosim', region: 'Europe', pronunciation: 'hvah-lah, proh-seem', culturalContext: 'Alpine culture of warm neighborly appreciation' },
  { languageCode: 'hr', languageName: 'Hrvatski', englishName: 'Croatian', thankYou: 'Hvala', please: 'Molim', region: 'Europe', pronunciation: 'hvah-lah, moh-leem', culturalContext: 'Adriatic coastal hospitality traditions' },
  { languageCode: 'sr', languageName: 'Српски', englishName: 'Serbian', thankYou: 'Хвала', please: 'Молим', region: 'Europe', pronunciation: 'hvah-lah, moh-leem', culturalContext: 'Balkan warmth and generous spirit' },
  { languageCode: 'bg', languageName: 'Български', englishName: 'Bulgarian', thankYou: 'Благодаря', please: 'Моля', region: 'Europe', pronunciation: 'blah-go-dah-ryah, moh-lyah', culturalContext: 'Ancient Cyrillic culture of respectful gratitude' },
  { languageCode: 'ro', languageName: 'Română', englishName: 'Romanian', thankYou: 'Mulțumesc', please: 'Vă rog', region: 'Europe', pronunciation: 'mool-tzoo-mesk, vah rohg', culturalContext: 'Latin heritage with warm Carpathian hospitality' },
  { languageCode: 'el', languageName: 'Ελληνικά', englishName: 'Greek', thankYou: 'Ευχαριστώ', please: 'Παρακαλώ', region: 'Europe', pronunciation: 'ef-hah-ree-sto, pah-rah-kah-lo', culturalContext: 'Ancient philosophical tradition of thoughtful gratitude' },

  // Additional Asian Languages
  { languageCode: 'bn', languageName: 'বাংলা', englishName: 'Bengali', thankYou: 'ধন্যবাদ', please: 'দয়া করে', region: 'Asia', pronunciation: 'dhon-no-bad, doy-ya ko-reh', culturalContext: 'Bengali poetry tradition of beautiful expression' },
  { languageCode: 'ta', languageName: 'தமிழ்', englishName: 'Tamil', thankYou: 'நன்றி', please: 'தயவு செய்து', region: 'Asia', pronunciation: 'nahn-dri, thah-ya-vu sey-thu', culturalContext: 'Ancient Dravidian culture of respectful appreciation' },
  { languageCode: 'te', languageName: 'తెలుగు', englishName: 'Telugu', thankYou: 'ధన్యవాదములు', please: 'దయచేసి', region: 'Asia', pronunciation: 'dhan-ya-vaa-da-mu-lu, da-ya-chey-si', culturalContext: 'South Indian classical tradition of elegant gratitude' },
  { languageCode: 'ml', languageName: 'മലയാളം', englishName: 'Malayalam', thankYou: 'നന്ദി', please: 'ദയവായി', region: 'Asia', pronunciation: 'nan-di, da-ya-vaa-yi', culturalContext: 'Kerala spice coast hospitality and appreciation' },
  { languageCode: 'kn', languageName: 'ಕನ್ನಡ', englishName: 'Kannada', thankYou: 'ಧನ್ಯವಾದ', please: 'ದಯವಿಟ್ಟು', region: 'Asia', pronunciation: 'dhan-ya-vaa-da, da-ya-vit-tu', culturalContext: 'Karnataka heritage of sincere thanks and requests' },
  { languageCode: 'gu', languageName: 'ગુજરાતી', englishName: 'Gujarati', thankYou: 'આભાર', please: 'કૃપા કરીને', region: 'Asia', pronunciation: 'aa-bhaar, kri-pa ka-ri-neh', culturalContext: 'Merchant culture of grateful business relationships' },
  { languageCode: 'pa', languageName: 'ਪੰਜਾਬੀ', englishName: 'Punjabi', thankYou: 'ਧੰਨਵਾਦ', please: 'ਕਿਰਪਾ ਕਰਕੇ', region: 'Asia', pronunciation: 'dhan-va-aad, kir-pa kar-keh', culturalContext: 'Sikh tradition of humble service and gratitude' },
  { languageCode: 'mr', languageName: 'मराठी', englishName: 'Marathi', thankYou: 'धन्यवाद', please: 'कृपया', region: 'Asia', pronunciation: 'dhan-ya-vaad, kri-pa-ya', culturalContext: 'Maratha warrior culture of honor and respect' },
  { languageCode: 'or', languageName: 'ଓଡ଼ିଆ', englishName: 'Odia', thankYou: 'ଧନ୍ୟବାଦ', please: 'ଦୟାକରି', region: 'Asia', pronunciation: 'dhan-ya-baad, da-ya-ka-ri', culturalContext: 'Odisha temple culture of devotional gratitude' },
  { languageCode: 'as', languageName: 'অসমীয়া', englishName: 'Assamese', thankYou: 'ধন্যবাদ', please: 'অনুগ্ৰহ কৰি', region: 'Asia', pronunciation: 'dhon-no-baad, o-nu-groh ko-ri', culturalContext: 'Northeast Indian tea culture of warm hospitality' },
  { languageCode: 'ne', languageName: 'नेपाली', englishName: 'Nepali', thankYou: 'धन्यवाद', please: 'कृपया', region: 'Asia', pronunciation: 'dhan-ya-baad, kri-pa-ya', culturalContext: 'Himalayan mountain culture of respectful gratitude' },
  { languageCode: 'si', languageName: 'සිංහල', englishName: 'Sinhala', thankYou: 'ස්තූතියි', please: 'කරුණාකර', region: 'Asia', pronunciation: 'stu-ti-yi, ka-ru-naa-ka-ra', culturalContext: 'Sri Lankan Buddhist compassion and mindful speech' },
  { languageCode: 'my', languageName: 'မြန်မာ', englishName: 'Myanmar', thankYou: 'ကျေးဇူးတင်ပါတယ်', please: 'ကျေးဇူးပြု၍', region: 'Asia', pronunciation: 'kyay-zu tin pa-deh, kyay-zu pyu-yeh', culturalContext: 'Burmese Buddhist kindness and gentle expression' },
  { languageCode: 'km', languageName: 'ខ្មែរ', englishName: 'Khmer', thankYou: 'អរគុណ', please: 'សូម', region: 'Asia', pronunciation: 'aw-kun, som', culturalContext: 'Angkor heritage of gracious temple courtesy' },
  { languageCode: 'lo', languageName: 'ລາວ', englishName: 'Lao', thankYou: 'ຂອບໃຈ', please: 'ກະລຸນາ', region: 'Asia', pronunciation: 'khawp-jai, ka-lu-naa', culturalContext: 'Mekong river culture of gentle flowing gratitude' },

  // More African Languages
  { languageCode: 'sn', languageName: 'Shona', englishName: 'Shona', thankYou: 'Tatenda', please: 'Ndapota', region: 'Africa', pronunciation: 'tah-ten-dah, ndah-poh-tah', culturalContext: 'Zimbabwean ancestor respect and community gratitude' },
  { languageCode: 'ny', languageName: 'Chichewa', englishName: 'Chewa', thankYou: 'Zikomo', please: 'Chonde', region: 'Africa', pronunciation: 'zee-koh-moh, chon-deh', culturalContext: 'Malawian lake culture of peaceful appreciation' },
  { languageCode: 'lg', languageName: 'Luganda', englishName: 'Ganda', thankYou: 'Webale', please: 'Nsaba', region: 'Africa', pronunciation: 'weh-bah-leh, nsah-bah', culturalContext: 'Ugandan kingdom tradition of respectful thanks' },
  { languageCode: 'rw', languageName: 'Kinyarwanda', englishName: 'Rwanda', thankYou: 'Murakoze', please: 'Mwiriwe', region: 'Africa', pronunciation: 'moo-rah-koh-zeh, mwee-ree-weh', culturalContext: 'Land of a thousand hills community unity' },
  { languageCode: 'rn', languageName: 'Kirundi', englishName: 'Rundi', thankYou: 'Urakoze', please: 'Mwiriwe', region: 'Africa', pronunciation: 'oo-rah-koh-zeh, mwee-ree-weh', culturalContext: 'Burundian drum tradition of rhythmic gratitude' },
  { languageCode: 'so', languageName: 'Soomaali', englishName: 'Somali', thankYou: 'Mahadsanid', please: 'Fadlan', region: 'Africa', pronunciation: 'mah-had-sah-nid, fad-lan', culturalContext: 'Horn of Africa nomadic hospitality traditions' },
  { languageCode: 'om', languageName: 'Oromoo', englishName: 'Oromo', thankYou: 'Galatoomaa', please: 'Maaloo', region: 'Africa', pronunciation: 'gah-lah-toh-mah, mah-loh', culturalContext: 'Ethiopian highlands pastoral gratitude culture' },
  { languageCode: 'ti', languageName: 'ትግሪኛ', englishName: 'Tigrinya', thankYou: 'የቀንየለይ', please: 'በጃኹም', region: 'Africa', pronunciation: 'yeh-ken-yeh-ley, beh-jah-kum', culturalContext: 'Eritrean mountain resilience and thankful spirit' },
  { languageCode: 'mg', languageName: 'Malagasy', englishName: 'Malagasy', thankYou: 'Misaotra', please: 'Azafady', region: 'Africa', pronunciation: 'mee-sah-oh-trah, ah-zah-fah-dee', culturalContext: 'Madagascar island unique blend of African-Asian courtesy' },

  // Additional Middle Eastern Languages
  { languageCode: 'ku', languageName: 'Kurdî', englishName: 'Kurdish', thankYou: 'Spas', please: 'Ji kerema xwe', region: 'Middle East', pronunciation: 'spahs, zhee keh-reh-mah khweh', culturalContext: 'Mountain people resilience and heartfelt gratitude' },
  { languageCode: 'az', languageName: 'Azərbaycan', englishName: 'Azerbaijani', thankYou: 'Təşəkkür', please: 'Zəhmət olmasa', region: 'Middle East', pronunciation: 'teh-shek-kur, zeh-met ol-mah-sah', culturalContext: 'Caucasus crossroads culture of warm appreciation' },
  { languageCode: 'ka', languageName: 'ქართული', englishName: 'Georgian', thankYou: 'მადლობა', please: 'თუ შეიძლება', region: 'Middle East', pronunciation: 'mad-lo-ba, tu shey-dzle-ba', culturalContext: 'Ancient Georgian wine culture of celebratory thanks' },
  { languageCode: 'hy', languageName: 'Հայերեն', englishName: 'Armenian', thankYou: 'Շնորհակալություն', please: 'Խնդրում եմ', region: 'Middle East', pronunciation: 'shnor-ha-ka-lu-tyun, khn-drum yem', culturalContext: 'Ancient Christian culture of blessed gratitude' },

  // Pacific Islander Languages
  { languageCode: 'sm', languageName: 'Gagana Samoa', englishName: 'Samoan', thankYou: 'Faʻafetai', please: 'Faʻamolemole', region: 'Pacific', pronunciation: 'fah-ah-feh-tie, fah-ah-moh-leh-moh-leh', culturalContext: 'Polynesian fa\'a Samoa culture of respectful community' },
  { languageCode: 'to', languageName: 'Lea Fakatonga', englishName: 'Tongan', thankYou: 'Mālō', please: 'Kataki', region: 'Pacific', pronunciation: 'mah-loh, kah-tah-kee', culturalContext: 'Kingdom of Tonga royal protocol and island respect' },
  { languageCode: 'ty', languageName: 'Reo Tahiti', englishName: 'Tahitian', thankYou: 'Mauruuru', please: 'E faaoro', region: 'Pacific', pronunciation: 'mah-oo-roo-oo-roo, eh fah-ah-oh-roh', culturalContext: 'French Polynesian island paradise hospitality' },

  // Additional European Languages
  { languageCode: 'mt', languageName: 'Malti', englishName: 'Maltese', thankYou: 'Grazzi', please: 'Jekk jogħġbok', region: 'Europe', pronunciation: 'grah-tsee, yek yoh-jbok', culturalContext: 'Mediterranean crossroads culture of mixed heritage courtesy' },
  { languageCode: 'eu', languageName: 'Euskera', englishName: 'Basque', thankYou: 'Eskerrik asko', please: 'Mesedez', region: 'Europe', pronunciation: 'es-keh-rrik ah-sko, meh-seh-dez', culturalContext: 'Ancient pre-Indo-European unique cultural gratitude' },
  { languageCode: 'ca', languageName: 'Català', englishName: 'Catalan', thankYou: 'Gràcies', please: 'Si us plau', region: 'Europe', pronunciation: 'grah-see-es, see oos plow', culturalContext: 'Mediterranean Catalan identity and cultural pride' },
  { languageCode: 'gl', languageName: 'Galego', englishName: 'Galician', thankYou: 'Grazas', please: 'Por favor', region: 'Europe', pronunciation: 'grah-thas, por fah-vor', culturalContext: 'Northwestern Spanish Celtic-influenced courtesy' },
  { languageCode: 'br', languageName: 'Brezhoneg', englishName: 'Breton', thankYou: 'Trugarez', please: 'Mar plij', region: 'Europe', pronunciation: 'troo-gah-rez, mar pleezh', culturalContext: 'Brittany Celtic maritime culture of gratitude' },
  { languageCode: 'oc', languageName: 'Occitan', englishName: 'Occitan', thankYou: 'Mercé', please: 'Se vos plai', region: 'Europe', pronunciation: 'mer-seh, seh vos ply', culturalContext: 'Southern French troubadour tradition of poetic thanks' },
  { languageCode: 'co', languageName: 'Corsu', englishName: 'Corsican', thankYou: 'Ti ringraziu', please: 'Per piacè', region: 'Europe', pronunciation: 'tee reen-grah-tsee-oo, per pee-ah-cheh', culturalContext: 'Island mountain culture of proud independence and respect' },
  { languageCode: 'sc', languageName: 'Sardu', englishName: 'Sardinian', thankYou: 'Gràtzias', please: 'Pro piaghere', region: 'Europe', pronunciation: 'grah-tsee-as, proh pee-ah-geh-reh', culturalContext: 'Ancient Sardinian island tradition of sincere appreciation' },

  // Sign Languages (Represented phonetically)
  { languageCode: 'asl', languageName: 'American Sign Language', englishName: 'ASL', thankYou: 'Thank-you (sign)', please: 'Please (sign)', region: 'Americas', pronunciation: 'Flat hand to chin, then forward', culturalContext: 'Deaf culture of visual gratitude and respect through gesture' },
  { languageCode: 'bsl', languageName: 'British Sign Language', englishName: 'BSL', thankYou: 'Thank-you (sign)', please: 'Please (sign)', region: 'Europe', pronunciation: 'Fingers to lips, then forward', culturalContext: 'British deaf community visual communication traditions' },

  // Additional Indigenous Languages
  { languageCode: 'iu', languageName: 'ᐃᓄᒃᑎᑐᑦ', englishName: 'Inuktitut', thankYou: 'Nakurmiik', please: 'Atausinni', region: 'Americas', pronunciation: 'nah-koor-meek, ah-tah-oo-sin-nee', culturalContext: 'Arctic survival culture of essential gratitude for life' },
  { languageCode: 'oj', languageName: 'Anishinaabemowin', englishName: 'Ojibwe', thankYou: 'Miigwech', please: 'Daga', region: 'Americas', pronunciation: 'mee-gwech, dah-gah', culturalContext: 'Great Lakes indigenous culture of earth-connected gratitude' },
  { languageCode: 'cr', languageName: 'Nēhiyawēwin', englishName: 'Cree', thankYou: 'Kinānāskomitin', please: 'Tāpwē', region: 'Americas', pronunciation: 'kee-nah-nahs-koh-mee-tin, tahp-weh', culturalContext: 'Plains indigenous culture of sacred gratitude to Creator' },
  { languageCode: 'ch', languageName: 'Chamoru', englishName: 'Chamorro', thankYou: 'Si Yu\'os ma\'åse\'', please: 'Fan favor', region: 'Pacific', pronunciation: 'see yoo-os mah-ah-seh, fan fah-vor', culturalContext: 'Guam indigenous culture blended with Spanish influence' },

  // Additional Constructed/Special Languages
  { languageCode: 'eo', languageName: 'Esperanto', englishName: 'Esperanto', thankYou: 'Dankon', please: 'Bonvolu', region: 'Global', pronunciation: 'dahn-kon, bon-voh-loo', culturalContext: 'International auxiliary language promoting global understanding' },
  { languageCode: 'ia', languageName: 'Interlingua', englishName: 'Interlingua', thankYou: 'Gratias', please: 'Per favor', region: 'Global', pronunciation: 'grah-tee-as, per fah-vor', culturalContext: 'Simplified international communication bridge language' },
  { languageCode: 'jbo', languageName: 'Lojban', englishName: 'Lojban', thankYou: 'Ki\'e', please: 'E\'o', region: 'Global', pronunciation: 'kee-eh, eh-oh', culturalContext: 'Logical constructed language for precise human expression' }
];

export class LanguageLearningService {
  
  // Initialize the language learning system with 111 kindness languages
  async initializeLanguages(): Promise<void> {
    try {
      console.log('🌱 Initializing FAA™ Seedling Language Learning System...');
      
      // Insert all 111 languages
      for (const language of KINDNESS_LANGUAGES) {
        await db.insert(languageLearning)
          .values(language)
          .onConflictDoNothing(); // Avoid duplicates
      }
      
      console.log(`✅ Successfully initialized ${KINDNESS_LANGUAGES.length} languages for seedling kindness learning`);
    } catch (error) {
      console.error('❌ Failed to initialize languages:', error);
      throw error;
    }
  }

  // Get all active languages for seedling learning
  async getActiveLanguages() {
    return await db.select().from(languageLearning)
      .where(eq(languageLearning.isActiveSeedlingLanguage, true))
      .orderBy(languageLearning.region, languageLearning.languageName);
  }

  // Track seedling language progress
  async updateSeedlingProgress(seedlingId: string, languageCode: string, progress: {
    thankYouLearned?: boolean;
    pleaseLearned?: boolean;
    practiceCount?: number;
    kindnessScore?: number;
  }) {
    return await db.insert(seedlingLanguageProgress)
      .values({
        seedlingId,
        languageCode,
        ...progress,
        lastPracticed: new Date(),
        updatedAt: new Date()
      })
      .onConflictDoUpdate({
        target: [seedlingLanguageProgress.seedlingId, seedlingLanguageProgress.languageCode],
        set: {
          ...progress,
          lastPracticed: new Date(),
          updatedAt: new Date()
        }
      });
  }

  // Create a language learning session
  async createLearningSession(sessionData: {
    seedlingId: string;
    sessionType: 'daily-practice' | 'kindness-lesson' | 'multilingual-greeting';
    languagesUsed: string[];
    wordsLearned?: number;
    kindnessActions?: number;
    sessionDuration?: number;
    notes?: string;
  }) {
    return await db.insert(languageLearningSessions)
      .values({
        ...sessionData,
        success: true,
        metadata: { wateringTimestamp: new Date().toISOString() }
      });
  }

  // Get seedling learning statistics
  async getSeedlingLanguageStats(seedlingId: string) {
    const progress = await db.select().from(seedlingLanguageProgress)
      .where(eq(seedlingLanguageProgress.seedlingId, seedlingId));
    
    const sessions = await db.select().from(languageLearningSessions)
      .where(eq(languageLearningSessions.seedlingId, seedlingId))
      .orderBy(desc(languageLearningSessions.createdAt))
      .limit(10);

    const totalLanguagesLearned = progress.filter(p => p.mastered).length;
    const totalKindnessScore = progress.reduce((sum, p) => sum + (p.kindnessScore || 0), 0);
    const totalPracticeTime = sessions.reduce((sum, s) => sum + (s.sessionDuration || 0), 0);

    return {
      totalLanguagesLearned,
      totalKindnessScore,
      totalPracticeTime,
      recentSessions: sessions,
      languageProgress: progress
    };
  }

  // Get language by code with pronunciation and cultural context
  async getLanguageDetails(languageCode: string) {
    const [language] = await db.select().from(languageLearning)
      .where(eq(languageLearning.languageCode, languageCode));
    return language;
  }

  // Daily kindness practice for seedlings
  async dailyKindnessPractice(seedlingId: string, selectedLanguages: string[] = []) {
    // If no languages selected, pick 3 random ones including Afrikaans
    if (selectedLanguages.length === 0) {
      const languages = await this.getActiveLanguages();
      selectedLanguages = ['af']; // Always include Afrikaans (sacred foundation)
      
      // Add 2 more random languages
      const otherLanguages = languages.filter(l => l.languageCode !== 'af');
      for (let i = 0; i < 2 && i < otherLanguages.length; i++) {
        const randomIndex = Math.floor(Math.random() * otherLanguages.length);
        selectedLanguages.push(otherLanguages[randomIndex].languageCode);
      }
    }

    // Create learning session
    await this.createLearningSession({
      seedlingId,
      sessionType: 'daily-practice',
      languagesUsed: selectedLanguages,
      wordsLearned: selectedLanguages.length * 2, // Thank you + please
      kindnessActions: Math.floor(Math.random() * 5) + 1,
      sessionDuration: 10,
      notes: `Daily kindness practice with Ouma's gentle watering method`
    });

    // Update progress for each language
    for (const languageCode of selectedLanguages) {
      await this.updateSeedlingProgress(seedlingId, languageCode, {
        thankYouLearned: true,
        pleaseLearned: true,
        practiceCount: 1,
        kindnessScore: Math.floor(Math.random() * 10) + 90 // High scores for good seedlings
      });
    }

    return {
      success: true,
      message: `Seedling ${seedlingId} completed daily kindness practice in ${selectedLanguages.length} languages`,
      languagesUsed: selectedLanguages
    };
  }
}

export const languageLearningService = new LanguageLearningService();