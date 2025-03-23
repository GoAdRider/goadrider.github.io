source "https://rubygems.org"

gem "jekyll", "~> 4.3.2"
gem "github-pages", group: :jekyll_plugins
gem "jekyll-remote-theme"
gem "jekyll-polyglot", "~> 1.6.0"

group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.17.0"
  gem "jekyll-seo-tag", "~> 2.8.0"
  gem "jekyll-sitemap", "~> 1.4.0"
  gem "jekyll-include-cache", "~> 0.2.1"
  gem "jekyll-paginate", "~> 1.1.0"
end

# Windows and JRuby compatibility
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

# Performance-booster for watching directories
gem "wdm", "~> 0.1.1", :platforms => [:mingw, :x64_mingw, :mswin]
gem "webrick", "~> 1.8" 