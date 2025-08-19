#!/usr/bin/env python3
"""
Multi-node verification script for The Ruchy Programming Language book deployment.
This script implements the same verification logic as the GitHub Actions but locally.
"""

import urllib.request
import urllib.error
import sys
import time
from html.parser import HTMLParser

class RuchyBookParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.title = ""
        self.in_title = False
        self.nav_links = 0
        self.ruchy_mentions = 0
        self.programming_mentions = 0
        self.chapter_links = 0
        
    def handle_starttag(self, tag, attrs):
        if tag == 'title':
            self.in_title = True
        elif tag == 'a':
            self.nav_links += 1
            # Check for chapter links
            for attr, value in attrs:
                if attr == 'href' and 'ch' in str(value).lower():
                    self.chapter_links += 1
                    
    def handle_endtag(self, tag):
        if tag == 'title':
            self.in_title = False
            
    def handle_data(self, data):
        if self.in_title:
            self.title += data
        
        data_lower = data.lower()
        if 'ruchy' in data_lower:
            self.ruchy_mentions += data_lower.count('ruchy')
        if 'programming' in data_lower:
            self.programming_mentions += data_lower.count('programming')

def test_url(url, method_name):
    """Test a URL using the specified method and return results."""
    print(f"\n🧪 {method_name}")
    print("=" * (len(method_name) + 4))
    
    try:
        # Custom headers to identify our verification
        headers = {
            'User-Agent': 'Ruchy-Book-Verification/1.0 (Multi-Node-Test)'
        }
        
        request = urllib.request.Request(url, headers=headers)
        
        print(f"🔍 Testing URL: {url}")
        
        # Make request with timeout
        with urllib.request.urlopen(request, timeout=30) as response:
            content = response.read().decode('utf-8')
            
            print(f"📊 Status: {response.status}")
            print(f"📊 Content length: {len(content)} characters")
            print(f"📊 Word count: {len(content.split())} words")
            
            # Show first part of content
            print(f"\n📄 First 500 characters:")
            print(content[:500])
            print("...")
            
            # Parse content for analysis
            parser = RuchyBookParser()
            parser.feed(content)
            
            print(f"\n📖 Analysis Results:")
            print(f"  Title: '{parser.title.strip()}'")
            print(f"  Navigation links: {parser.nav_links}")
            print(f"  Chapter links: {parser.chapter_links}")
            print(f"  'Ruchy' mentions: {parser.ruchy_mentions}")
            print(f"  'Programming' mentions: {parser.programming_mentions}")
            
            # Quality checks
            checks = {
                'HTTP 200': response.status == 200,
                'Substantial content': len(content) > 1000,
                'Sufficient words': len(content.split()) > 100,
                'Contains Ruchy': parser.ruchy_mentions > 0,
                'Contains Programming': parser.programming_mentions > 0,
                'Has navigation': parser.nav_links > 5,
                'Has chapters': parser.chapter_links > 0,
                'Has title': bool(parser.title.strip())
            }
            
            passed_checks = sum(checks.values())
            total_checks = len(checks)
            
            print(f"\n✅ Quality Checks:")
            for check_name, passed in checks.items():
                status = "✅" if passed else "❌"
                print(f"  {status} {check_name}")
            
            score = passed_checks / total_checks * 100
            print(f"\n📊 Overall Score: {passed_checks}/{total_checks} ({score:.1f}%)")
            
            return {
                'success': passed_checks >= 6,  # Need at least 6/8 checks
                'score': score,
                'checks_passed': passed_checks,
                'total_checks': total_checks,
                'content_length': len(content),
                'word_count': len(content.split()),
                'ruchy_mentions': parser.ruchy_mentions,
                'title': parser.title.strip()
            }
            
    except urllib.error.HTTPError as e:
        print(f"❌ HTTP Error {e.code}: {e.reason}")
        return {'success': False, 'error': f'HTTP {e.code}'}
        
    except urllib.error.URLError as e:
        print(f"❌ URL Error: {e.reason}")
        return {'success': False, 'error': f'URL Error: {e.reason}'}
        
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return {'success': False, 'error': f'Exception: {e}'}

def main():
    """Main verification function."""
    print("🌐 MULTI-NODE RUCHY BOOK VERIFICATION")
    print("=" * 50)
    print(f"🕒 Verification started at: {time.strftime('%Y-%m-%d %H:%M:%S UTC', time.gmtime())}")
    
    # Test URLs to try
    test_urls = [
        ("https://paiml.github.io/ruchy-book/", "GitHub Pages Direct"),
        ("https://book.ruchy.org/", "Custom Domain (Expected to fail)")
    ]
    
    results = []
    
    for url, description in test_urls:
        print(f"\n{'='*60}")
        print(f"Testing: {description}")
        print(f"URL: {url}")
        print(f"{'='*60}")
        
        result = test_url(url, description)
        result['url'] = url
        result['description'] = description
        results.append(result)
        
        # Brief pause between tests
        time.sleep(2)
    
    # Final analysis
    print(f"\n{'='*60}")
    print("🏁 FINAL VERIFICATION RESULTS")
    print(f"{'='*60}")
    
    successful_tests = [r for r in results if r.get('success', False)]
    total_tests = len(results)
    success_count = len(successful_tests)
    
    print(f"\n📊 Summary:")
    print(f"  Total tests: {total_tests}")
    print(f"  Successful tests: {success_count}")
    print(f"  Success rate: {success_count/total_tests*100:.1f}%")
    
    for result in results:
        status = "✅ PASS" if result.get('success', False) else "❌ FAIL"
        description = result.get('description', 'Unknown')
        print(f"  {status} {description}")
        if 'error' in result:
            print(f"    Error: {result['error']}")
        elif result.get('success'):
            print(f"    Score: {result.get('score', 0):.1f}% ({result.get('checks_passed', 0)}/{result.get('total_checks', 0)} checks)")
    
    # Determine overall result
    if success_count >= 1:  # Need at least 1 successful test
        print(f"\n🎉 VERIFICATION SUCCESSFUL!")
        print(f"The Ruchy Programming Language book is accessible and functioning correctly!")
        
        if successful_tests:
            best_result = max(successful_tests, key=lambda x: x.get('score', 0))
            print(f"\n📚 Best performing URL: {best_result['url']}")
            print(f"   Content: {best_result.get('word_count', 0):,} words")
            print(f"   Ruchy mentions: {best_result.get('ruchy_mentions', 0)}")
            print(f"   Title: {best_result.get('title', 'N/A')}")
        
        return 0
    else:
        print(f"\n❌ VERIFICATION FAILED!")
        print(f"The book website is not accessible or has serious issues.")
        return 1

if __name__ == "__main__":
    sys.exit(main())