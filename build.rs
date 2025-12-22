use std::{process::Command, env, path::PathBuf};

fn main() {
    if env::var("PROFILE").unwrap_or_default() != "release" {
        return;
    }

    // Desktop/ path
    let desktop_dir = PathBuf::from(env::var("CARGO_MANIFEST_DIR").unwrap());

    // Workspace root
    let workspace_root = desktop_dir
        .parent()
        .expect("Desktop must be inside workspace root");

    println!("cargo:rerun-if-changed={}", workspace_root.join("Source").display());
    println!("cargo:rerun-if-changed={}", workspace_root.join("index.html").display());
    println!("cargo:rerun-if-changed={}", workspace_root.join("package.json").display());
    println!("cargo:rerun-if-changed={}", workspace_root.join("vite.config.ts").display());

    let status = Command::new("bun")
        .args(["x", "vite", "build"])
        .current_dir(workspace_root)
        .status()
        .expect("bun not found. Install bun.");

    if !status.success() {
        panic!("Frontend build failed (bun x vite build)");
    }

    println!("Frontend built successfully");
}
