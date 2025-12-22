use std::process::Command;

fn main() {
    // Only build frontend in release mode
    if std::env::var("PROFILE").unwrap() == "release" {
        println!("cargo:rerun-if-changed=www/src");
        println!("cargo:rerun-if-changed=www/index.html");
        println!("cargo:rerun-if-changed=www/package.json");

        // Build the frontend
        let output = Command::new("bun")
            .args(&["run", "build"])
            .current_dir("www")
            .output()
            .or_else(|_| {
                // Fallback to npm if bun is not available
                Command::new("npm")
                    .args(&["run", "build"])
                    .current_dir("www")
                    .output()
            })
            .expect("Failed to build frontend. Make sure bun or npm is installed.");

        if !output.status.success() {
            panic!(
                "Frontend build failed: {}",
                String::from_utf8_lossy(&output.stderr)
            );
        }

        println!("Frontend built successfully");
    }
}