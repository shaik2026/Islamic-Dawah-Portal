using MediaPortal.Models;

namespace MediaPortal.Data
{
    public static class SeedData
    {
        public static void Initialize(MediaPortalContext context)
        {
            // Seed Articles
            if (!context.Articles.Any())
            {
                context.Articles.AddRange(
                    new Article
                    {
                        Title = "The Five Pillars of Islam: A Complete Guide",
                        Content = "The Five Pillars of Islam are the foundation of Muslim life. They are Shahada (faith), Salah (prayer), Zakat (charity), Sawm (fasting), and Hajj (pilgrimage). These pillars unite Muslims worldwide in their worship and devotion to Allah. Each pillar serves as a spiritual practice that strengthens our connection with the Creator and our community. Understanding and implementing these pillars is essential for every Muslim's spiritual journey...",
                        Author = "Sheikh Abdullah",
                        Category = "Islamic Foundations",
                        ImageUrl = "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800",
                        PublishedDate = DateTime.Now.AddDays(-5),
                        Views = 2834,
                        Tags = new List<string> { "pillars", "basics", "islam", "faith" }
                    },
                    new Article
                    {
                        Title = "Understanding Tawheed: The Oneness of Allah",
                        Content = "Tawheed is the fundamental concept in Islam - the belief in the absolute oneness and uniqueness of Allah. It is the foundation upon which the entire religion is built. Tawheed encompasses Allah's oneness in His lordship, worship, and names and attributes. This article explores the three categories of Tawheed and their importance in a Muslim's life and faith...",
                        Author = "Dr. Fatima Ahmed",
                        Category = "Aqeedah",
                        ImageUrl = "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=800",
                        PublishedDate = DateTime.Now.AddDays(-3),
                        Views = 1967,
                        Tags = new List<string> { "tawheed", "aqeedah", "belief", "monotheism" }
                    },
                    new Article
                    {
                        Title = "The Beautiful Names of Allah (Asma ul Husna)",
                        Content = "Allah has 99 beautiful names, each reflecting His perfect attributes and qualities. Learning and understanding these names deepens our love and knowledge of our Creator. From Ar-Rahman (The Most Merciful) to Al-Hakim (The All-Wise), each name teaches us about Allah's nature and how we should worship Him. This comprehensive guide explores the meanings and significance of Allah's beautiful names...",
                        Author = "Imam Hassan",
                        Category = "Allah's Attributes",
                        ImageUrl = "https://images.unsplash.com/photo-1590650213165-d49f96a9276c?w=800",
                        PublishedDate = DateTime.Now.AddDays(-7),
                        Views = 3421,
                        Tags = new List<string> { "names", "attributes", "allah", "99-names" }
                    },
                    new Article
                    {
                        Title = "Prophet Muhammad ﷺ: The Final Messenger",
                        Content = "Prophet Muhammad (peace be upon him) is the final messenger sent by Allah to guide humanity. His life, teachings, and character serve as the perfect example for all Muslims. Born in Makkah in 570 CE, he received the first revelation at age 40 and spent 23 years spreading the message of Islam. His Sunnah (way of life) provides guidance on every aspect of life, from worship to social interactions...",
                        Author = "Sheikh Omar",
                        Category = "Seerah",
                        ImageUrl = "https://images.unsplash.com/photo-1584289457850-372a19b5bfb0?w=800",
                        PublishedDate = DateTime.Now.AddDays(-2),
                        Views = 2156,
                        Tags = new List<string> { "prophet", "muhammad", "seerah", "biography" }
                    }
                );
            }

            // Seed Videos
            if (!context.Videos.Any())
            {
                context.Videos.AddRange(
                    new Video
                    {
                        Title = "Introduction to Islam: What Every Muslim Should Know",
                        Description = "A comprehensive introduction to Islam covering the basics of faith, pillars, and essential beliefs every Muslim needs to understand.",
                        VideoUrl = "https://www.youtube.com/embed/GhQdlIFylQ8",
                        ThumbnailUrl = "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800",
                        Category = "Islamic Education",
                        Author = "Sheikh Yasir Qadhi",
                        PublishedDate = DateTime.Now.AddDays(-10),
                        Views = 8432,
                        Duration = TimeSpan.FromMinutes(45),
                        Tags = new List<string> { "islam", "basics", "education", "beginners" }
                    },
                    new Video
                    {
                        Title = "The Life of Prophet Muhammad ﷺ - Complete Seerah",
                        Description = "An in-depth biography of Prophet Muhammad (peace be upon him) from birth to his final days. Learn about the life of the greatest man in history.",
                        VideoUrl = "https://www.youtube.com/embed/TNhaISOUy6Q",
                        ThumbnailUrl = "https://images.unsplash.com/photo-1584289457850-372a19b5bfb0?w=800",
                        Category = "Seerah",
                        Author = "Mufti Menk",
                        PublishedDate = DateTime.Now.AddDays(-6),
                        Views = 12510,
                        Duration = TimeSpan.FromMinutes(52),
                        Tags = new List<string> { "prophet", "muhammad", "seerah", "biography" }
                    },
                    new Video
                    {
                        Title = "How to Perform Salah (Prayer) - Step by Step Guide",
                        Description = "Learn the correct way to perform the five daily prayers with detailed explanations of each position, recitation, and intention.",
                        VideoUrl = "https://www.youtube.com/embed/fmvcAzHpsk8",
                        ThumbnailUrl = "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800",
                        Category = "Prayer",
                        Author = "Sheikh Omar Suleiman",
                        PublishedDate = DateTime.Now.AddDays(-4),
                        Views = 15867,
                        Duration = TimeSpan.FromMinutes(38),
                        Tags = new List<string> { "salah", "prayer", "worship", "tutorial" }
                    }
                );
            }

            // Seed Questions
            if (!context.Questions.Any())
            {
                var questions = new[]
                {
                    new Question
                    {
                        Title = "What are the conditions for Wudu (ablution) to be valid?",
                        Content = "I want to make sure I'm performing wudu correctly. What are the essential conditions and steps that must be followed for wudu to be valid according to Islamic teachings?",
                        Author = "Ahmad Hassan",
                        Category = "Fiqh",
                        AskedDate = DateTime.Now.AddDays(-8),
                        Views = 856,
                        Tags = new List<string> { "wudu", "purification", "fiqh", "worship" },
                        Answers = new List<Answer>
                        {
                            new Answer
                            {
                                Content = "Wudu has several conditions: 1) Intention (niyyah), 2) Washing the face, 3) Washing both arms up to the elbows, 4) Wiping the head, 5) Washing both feet up to the ankles. These must be done in order without long breaks between them. The Prophet ﷺ demonstrated the proper method which we follow.",
                                Author = "Sheikh Abdullah Rahman",
                                AnsweredDate = DateTime.Now.AddDays(-7),
                                Votes = 24,
                                IsAccepted = true
                            },
                            new Answer
                            {
                                Content = "In addition to the steps mentioned, ensure you use clean water and that there are no barriers preventing water from reaching your skin (like nail polish). The intention should be made in your heart before starting.",
                                Author = "Ustadh Ibrahim",
                                AnsweredDate = DateTime.Now.AddDays(-7),
                                Votes = 12,
                                IsAccepted = false
                            }
                        }
                    },
                    new Question
                    {
                        Title = "How can I develop a stronger connection with the Quran?",
                        Content = "I read the Quran but sometimes struggle to feel connected. What are some practical ways to strengthen my relationship with Allah's book and make its recitation more meaningful?",
                        Author = "Aisha Mohammed",
                        Category = "Spiritual Development",
                        AskedDate = DateTime.Now.AddDays(-5),
                        Views = 1234,
                        Tags = new List<string> { "quran", "spirituality", "connection", "recitation" },
                        Answers = new List<Answer>
                        {
                            new Answer
                            {
                                Content = "Start by learning the meanings of what you recite. Even if you can't understand Arabic fully, read the translation. Also, recite with tajweed slowly and thoughtfully. Set a daily routine, even if it's just a few verses. Reflect on the verses and try to apply them in your daily life. Make dua before reciting asking Allah to open your heart to His words.",
                                Author = "Dr. Khadijah Ahmed",
                                AnsweredDate = DateTime.Now.AddDays(-4),
                                Votes = 31,
                                IsAccepted = true
                            }
                        }
                    },
                    new Question
                    {
                        Title = "Is it permissible to celebrate the Prophet's ﷺ birthday (Mawlid)?",
                        Content = "There are different opinions about celebrating Mawlid al-Nabi. What is the Islamic ruling on this, and what were the practices of the early generations?",
                        Author = "Yusuf Ali",
                        Category = "Islamic Rulings",
                        AskedDate = DateTime.Now.AddDays(-3),
                        Views = 2167,
                        Tags = new List<string> { "mawlid", "celebration", "fiqh", "bidah" },
                        Answers = new List<Answer>
                        {
                            new Answer
                            {
                                Content = "This is a matter of scholarly difference. Some scholars permit it as an expression of love for the Prophet ﷺ, while others consider it an innovation (bidah) as it wasn't practiced by the Companions or early generations. What's most important is following the Sunnah in all aspects of life throughout the year, not just on one day. The best way to honor the Prophet ﷺ is to follow his teachings and send salawat upon him regularly.",
                                Author = "Sheikh Omar Abdullah",
                                AnsweredDate = DateTime.Now.AddDays(-2),
                                Votes = 18,
                                IsAccepted = true
                            }
                        }
                    }
                };

                context.Questions.AddRange(questions);
            }

            context.SaveChanges();
        }
    }
}
