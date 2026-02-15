using MediaPortal.Models;

namespace MediaPortal.Data
{
    public static class SeedData
    {
        public static void Initialize(MediaPortalContext context)
        {
            // Seed Categories
            if (!context.Categories.Any())
            {
                context.Categories.AddRange(
                    new Category { Name = "Islamic Foundations", Description = "Core beliefs and practices", Type = "Article" },
                    new Category { Name = "Aqeedah", Description = "Islamic Creed", Type = "Article" },
                    new Category { Name = "Allah's Attributes", Description = "Names and Attributes of Allah", Type = "Article" },
                    new Category { Name = "Seerah", Description = "Biography of the Prophet", Type = "Article" },
                    
                    new Category { Name = "Islamic Education", Description = "General Islamic knowledge", Type = "Video" },
                    new Category { Name = "Seerah (Video)", Description = "Biography of the Prophet (Video)", Type = "Video" },
                    new Category { Name = "Prayer", Description = "Salah guides", Type = "Video" },

                    new Category { Name = "Fiqh", Description = "Jurisprudence", Type = "Question" },
                    new Category { Name = "Spiritual Development", Description = "Tazkiyah", Type = "Question" },
                    new Category { Name = "Islamic Rulings", Description = "Fatwas", Type = "Question" }
                );
                context.SaveChanges();
            }

            // Helper to find category ID by name
            int GetCatId(string name, string type) =>
                context.Categories
                    .Where(c => c.Name == name && c.Type == type)
                    .Select(c => c.Id)
                    .FirstOrDefault();

            // Seed Articles
            if (!context.Articles.Any())
            {
                context.Articles.AddRange(
                    new Article
                    {
                        Title = "The Five Pillars of Islam: A Complete Guide",
                        Content = "The Five Pillars of Islam are the foundation of Muslim life...",
                        Author = "Sheikh Abdullah",
                        CategoryId = GetCatId("Islamic Foundations", "Article"),
                        ImageUrl = "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800",
                        PublishedDate = DateTime.Now.AddDays(-5),
                        Views = 2834,
                        Tags = new List<string> { "pillars", "basics", "islam", "faith" }
                    },
                    new Article
                    {
                        Title = "Understanding Tawheed: The Oneness of Allah",
                        Content = "Tawheed is the fundamental concept in Islam...",
                        Author = "Dr. Fatima Ahmed",
                        CategoryId = GetCatId("Aqeedah", "Article"),
                        ImageUrl = "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=800",
                        PublishedDate = DateTime.Now.AddDays(-3),
                        Views = 1967,
                        Tags = new List<string> { "tawheed", "aqeedah", "belief", "monotheism" }
                    },
                    new Article
                    {
                        Title = "The Beautiful Names of Allah (Asma ul Husna)",
                        Content = "Allah has 99 beautiful names...",
                        Author = "Imam Hassan",
                        CategoryId = GetCatId("Allah's Attributes", "Article"),
                        ImageUrl = "https://images.unsplash.com/photo-1590650213165-d49f96a9276c?w=800",
                        PublishedDate = DateTime.Now.AddDays(-7),
                        Views = 3421,
                        Tags = new List<string> { "names", "attributes", "allah", "99-names" }
                    },
                    new Article
                    {
                        Title = "Prophet Muhammad: The Final Messenger",
                        Content = "Prophet Muhammad (peace be upon him) is the final messenger...",
                        Author = "Sheikh Omar",
                        CategoryId = GetCatId("Seerah", "Article"),
                        ImageUrl = "https://images.unsplash.com/photo-1584289457850-372a19b5bfb0?w=800",
                        PublishedDate = DateTime.Now.AddDays(-2),
                        Views = 2156,
                        Tags = new List<string> { "prophet", "muhammad", "seerah", "biography" }
                    }
                );
                context.SaveChanges();
            }

            // Seed Videos
            if (!context.Videos.Any())
            {
                context.Videos.AddRange(
                    new Video
                    {
                        Title = "Introduction to Islam: What Every Muslim Should Know",
                        Description = "A comprehensive introduction to Islam...",
                        VideoUrl = "https://www.youtube.com/embed/GhQdlIFylQ8",
                        ThumbnailUrl = "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800",
                        CategoryId = GetCatId("Islamic Education", "Video"),
                        Author = "Sheikh Yasir Qadhi",
                        PublishedDate = DateTime.Now.AddDays(-10),
                        Views = 8432,
                        Duration = TimeSpan.FromMinutes(45),
                        Tags = new List<string> { "islam", "basics", "education", "beginners" }
                    },
                    new Video
                    {
                        Title = "The Life of Prophet Muhammad - Complete Seerah",
                        Description = "An in-depth biography of Prophet Muhammad...",
                        VideoUrl = "https://www.youtube.com/embed/TNhaISOUy6Q",
                        ThumbnailUrl = "https://images.unsplash.com/photo-1584289457850-372a19b5bfb0?w=800",
                        CategoryId = GetCatId("Seerah (Video)", "Video"),
                        Author = "Mufti Menk",
                        PublishedDate = DateTime.Now.AddDays(-6),
                        Views = 12510,
                        Duration = TimeSpan.FromMinutes(52),
                        Tags = new List<string> { "prophet", "muhammad", "seerah", "biography" }
                    },
                    new Video
                    {
                        Title = "How to Perform Salah (Prayer) - Step by Step Guide",
                        Description = "Learn the correct way to perform the five daily prayers...",
                        VideoUrl = "https://www.youtube.com/embed/fmvcAzHpsk8",
                        ThumbnailUrl = "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800",
                        CategoryId = GetCatId("Prayer", "Video"),
                        Author = "Sheikh Omar Suleiman",
                        PublishedDate = DateTime.Now.AddDays(-4),
                        Views = 15867,
                        Duration = TimeSpan.FromMinutes(38),
                        Tags = new List<string> { "salah", "prayer", "worship", "tutorial" }
                    }
                );
                context.SaveChanges();
            }

            // Seed Questions
            if (!context.Questions.Any())
            {
                var questions = new[]
                {
                    new Question
                    {
                        Title = "What are the conditions for Wudu (ablution) to be valid?",
                        Content = "I want to make sure I'm performing wudu correctly...",
                        Author = "Ahmad Hassan",
                        CategoryId = GetCatId("Fiqh", "Question"),
                        AskedDate = DateTime.Now.AddDays(-8),
                        Views = 856,
                        Tags = new List<string> { "wudu", "purification", "fiqh", "worship" },
                        Answers = new List<Answer>
                        {
                            new Answer
                            {
                                Content = "Wudu has several conditions...",
                                Author = "Sheikh Abdullah Rahman",
                                AnsweredDate = DateTime.Now.AddDays(-7),
                                Votes = 24,
                                IsAccepted = true
                            },
                        }
                    },
                    new Question
                    {
                        Title = "How can I develop a stronger connection with the Quran?",
                        Content = "I read the Quran but sometimes struggle...",
                        Author = "Aisha Mohammed",
                        CategoryId = GetCatId("Spiritual Development", "Question"),
                        AskedDate = DateTime.Now.AddDays(-5),
                        Views = 1234,
                        Tags = new List<string> { "quran", "spirituality", "connection", "recitation" },
                        Answers = new List<Answer>
                        {
                            new Answer
                            {
                                Content = "Start by learning the meanings...",
                                Author = "Dr. Khadijah Ahmed",
                                AnsweredDate = DateTime.Now.AddDays(-4),
                                Votes = 31,
                                IsAccepted = true
                            }
                        }
                    },
                    new Question
                    {
                        Title = "Is it permissible to celebrate the Prophet's birthday (Mawlid)?",
                        Content = "There are different opinions about celebrating Mawlid...",
                        Author = "Yusuf Ali",
                        CategoryId = GetCatId("Islamic Rulings", "Question"),
                        AskedDate = DateTime.Now.AddDays(-3),
                        Views = 2167,
                        Tags = new List<string> { "mawlid", "celebration", "fiqh", "bidah" },
                        Answers = new List<Answer>
                        {
                            new Answer
                            {
                                Content = "This is a matter of scholarly difference...",
                                Author = "Sheikh Omar Abdullah",
                                AnsweredDate = DateTime.Now.AddDays(-2),
                                Votes = 18,
                                IsAccepted = true
                            }
                        }
                    }
                };

                context.Questions.AddRange(questions);
                context.SaveChanges();
            }
        }
    }
}
