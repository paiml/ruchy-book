/// Test harness for validating all Ruchy book code listings
/// Ensures every example compiles with current Ruchy version
/// Following implementation-first documentation principles

use ruchy::compile;
use std::fs;
use std::path::{Path, PathBuf};
use walkdir::WalkDir;

/// Find all .ruchy files in the listings directory
fn find_ruchy_listings() -> Vec<PathBuf> {
    let listings_dir = Path::new(env!("CARGO_MANIFEST_DIR")).join("listings");
    let mut listings = Vec::new();
    
    if listings_dir.exists() {
        for entry in WalkDir::new(&listings_dir) {
            if let Ok(entry) = entry {
                let path = entry.path();
                if path.extension().and_then(|s| s.to_str()) == Some("ruchy") {
                    listings.push(path.to_path_buf());
                }
            }
        }
    }
    
    listings.sort(); // Ensure deterministic test order
    listings
}

/// Compile a single Ruchy listing and verify it works
fn test_listing(path: &Path) -> Result<(), String> {
    // Read the source file
    let source = fs::read_to_string(path)
        .map_err(|e| format!("Failed to read {}: {}", path.display(), e))?;
    
    // Skip empty files
    if source.trim().is_empty() {
        return Ok(());
    }
    
    // Compile with Ruchy
    match compile(&source) {
        Ok(_) => {
            // Check if there's an expected output file
            let output_path = path.with_extension("output");
            if output_path.exists() {
                // In the future, we would execute and compare output
                // For now, just verify the file exists
                let _expected = fs::read_to_string(&output_path)
                    .map_err(|e| format!("Failed to read output file: {}", e))?;
                // Future: Execute compiled code and compare with expected output
            }
            Ok(())
        }
        Err(e) => Err(format!("Compilation failed for {}: {:?}", path.display(), e))
    }
}

#[test]
fn test_all_listings_compile() {
    let listings = find_ruchy_listings();
    
    if listings.is_empty() {
        println!("No .ruchy listings found to test");
        return;
    }
    
    let mut failures = Vec::new();
    
    for listing_path in &listings {
        println!("Testing: {}", listing_path.display());
        if let Err(e) = test_listing(listing_path) {
            failures.push(format!("{}: {}", listing_path.display(), e));
        }
    }
    
    if !failures.is_empty() {
        panic!(
            "❌ {} listing(s) failed compilation:\n{}",
            failures.len(),
            failures.join("\n")
        );
    }
    
    println!("✅ All {} listings compile successfully", listings.len());
}

#[test]
fn test_listings_have_valid_structure() {
    let listings_dir = Path::new(env!("CARGO_MANIFEST_DIR")).join("listings");
    
    if !listings_dir.exists() {
        return; // No listings yet
    }
    
    for chapter_entry in fs::read_dir(&listings_dir).expect("Failed to read listings dir") {
        let chapter_entry = chapter_entry.expect("Failed to read chapter entry");
        let chapter_path = chapter_entry.path();
        
        if !chapter_path.is_dir() {
            continue;
        }
        
        let chapter_name = chapter_path.file_name()
            .and_then(|n| n.to_str())
            .expect("Invalid chapter name");
        
        // Verify chapter naming convention (e.g., ch01-hello-world)
        assert!(
            chapter_name.starts_with("ch"),
            "Chapter directory should start with 'ch': {}",
            chapter_name
        );
        
        // Check for listing subdirectories
        for listing_entry in fs::read_dir(&chapter_path).expect("Failed to read chapter dir") {
            let listing_entry = listing_entry.expect("Failed to read listing entry");
            let listing_path = listing_entry.path();
            
            if !listing_path.is_dir() {
                continue;
            }
            
            let listing_name = listing_path.file_name()
                .and_then(|n| n.to_str())
                .expect("Invalid listing name");
            
            // Verify listing naming convention (e.g., listing-01-01)
            assert!(
                listing_name.starts_with("listing-"),
                "Listing directory should start with 'listing-': {}",
                listing_name
            );
            
            // Check for src directory
            let src_dir = listing_path.join("src");
            assert!(
                src_dir.exists(),
                "Listing should have src/ directory: {}",
                listing_path.display()
            );
        }
    }
}

#[test]
fn test_no_satd_in_listings() {
    let listings_dir = Path::new(env!("CARGO_MANIFEST_DIR")).join("listings");
    
    if !listings_dir.exists() {
        return;
    }
    
    let mut violations = Vec::new();
    
    for entry in WalkDir::new(&listings_dir) {
        if let Ok(entry) = entry {
            let path = entry.path();
            if path.extension().and_then(|s| s.to_str()) == Some("ruchy") {
                if let Ok(content) = fs::read_to_string(path) {
                    for (line_num, line) in content.lines().enumerate() {
                        if line.contains("TODO") || line.contains("FIXME") || line.contains("HACK") {
                            violations.push(format!(
                                "{}:{}: SATD comment found: {}",
                                path.display(),
                                line_num + 1,
                                line.trim()
                            ));
                        }
                    }
                }
            }
        }
    }
    
    assert!(
        violations.is_empty(),
        "❌ SATD comments found in listings:\n{}",
        violations.join("\n")
    );
}

#[test]
fn test_version_consistency() {
    // Check that all Cargo.toml files in listings use the same Ruchy version
    let expected_version = "=0.4.13"; // Must match exact version
    let listings_dir = Path::new(env!("CARGO_MANIFEST_DIR")).join("listings");
    
    if !listings_dir.exists() {
        return;
    }
    
    for entry in WalkDir::new(&listings_dir) {
        if let Ok(entry) = entry {
            let path = entry.path();
            if path.file_name() == Some(std::ffi::OsStr::new("Cargo.toml")) {
                if let Ok(content) = fs::read_to_string(path) {
                    // Simple check for ruchy version
                    if content.contains("ruchy =") {
                        assert!(
                            content.contains(&format!("ruchy = \"{}\"", expected_version)),
                            "Version mismatch in {}: expected {}",
                            path.display(),
                            expected_version
                        );
                    }
                }
            }
        }
    }
}