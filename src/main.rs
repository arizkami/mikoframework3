#![windows_subsystem = "windows"]
use wry::WebViewBuilder;
use winit::{
    event::WindowEvent,
    event_loop::{ActiveEventLoop, EventLoop},
    window::{Window, WindowId},
    application::ApplicationHandler,
    dpi::LogicalSize,
};
use std::sync::Arc;
use wgpu::{Instance, Adapter, Device, Queue};

mod core;
mod ipc;
mod context_menu;

use core::SharedAppState;
use ipc::handle_ipc_message;

#[cfg(debug_assertions)]
const DEV_SERVER_URL: &str = "http://localhost:5173";

#[cfg(not(debug_assertions))]
const INDEX_HTML: &str = include_str!("../www/Distribution/index.html");

struct WgpuState {
    instance: Instance,
    adapter: Option<Adapter>,
    device: Option<Device>,
    queue: Option<Queue>,
}

impl WgpuState {
    fn new() -> Self {
        println!("Creating WGPU instance...");
        let instance = Instance::new(&wgpu::InstanceDescriptor {
            backends: wgpu::Backends::all(),
            ..Default::default()
        });
        
        Self {
            instance,
            adapter: None,
            device: None,
            queue: None,
        }
    }
    
    async fn initialize(&mut self) -> Result<(), Box<dyn std::error::Error>> {
        println!("Requesting WGPU adapter...");
        let adapter = self.instance
            .request_adapter(&wgpu::RequestAdapterOptions {
                power_preference: wgpu::PowerPreference::default(),
                compatible_surface: None,
                force_fallback_adapter: false,
            })
            .await;
        
        let adapter = match adapter {
            Ok(adapter) => adapter,
            Err(e) => return Err(format!("Failed to find an appropriate adapter: {:?}", e).into()),
        };
        
        println!("Requesting WGPU device...");
        let (device, queue) = adapter
            .request_device(
                &wgpu::DeviceDescriptor {
                    label: None,
                    required_features: wgpu::Features::empty(),
                    required_limits: wgpu::Limits::default(),
                    memory_hints: wgpu::MemoryHints::default(),
                    ..Default::default()
                }
            )
            .await?;
        
        self.adapter = Some(adapter);
        self.device = Some(device);
        self.queue = Some(queue);
        
        println!("WGPU initialized successfully!");
        Ok(())
    }
}

struct App {
    window: Option<Arc<Window>>,
    webview: Option<wry::WebView>,
    state: SharedAppState,
    wgpu_state: Option<WgpuState>,
    initialization_complete: bool,
}

impl App {
    fn new() -> Self {
        Self {
            window: None,
            webview: None,
            state: core::create_shared_state(),
            wgpu_state: None,
            initialization_complete: false,
        }
    }
    
    async fn preload_wgpu(&mut self) -> Result<(), Box<dyn std::error::Error>> {
        let mut wgpu_state = WgpuState::new();
        wgpu_state.initialize().await?;
        
        // Update state
        {
            let mut state = self.state.lock().unwrap();
            state.wgpu_initialized = true;
            state.message = "WGPU initialized, loading WebView2...".to_string();
        }
        
        self.wgpu_state = Some(wgpu_state);
        Ok(())
    }
}

impl ApplicationHandler for App {
    fn resumed(&mut self, event_loop: &ActiveEventLoop) {
        if self.window.is_none() && !self.initialization_complete {
            println!("Starting initialization...");
            
            // Create window but keep it hidden initially
            let window_attributes = Window::default_attributes()
                .with_title("WGPU + Wry App - Initializing...")
                .with_inner_size(LogicalSize::new(1000, 700))
                .with_visible(false); // Hide window during initialization
            
            let window = Arc::new(event_loop.create_window(window_attributes).unwrap());
            self.window = Some(window.clone());
            
            // Start async initialization
            let state_clone = self.state.clone();
            let window_clone = window.clone();
            
            // Spawn initialization task
            std::thread::spawn(move || {
                let rt = tokio::runtime::Runtime::new().unwrap();
                rt.block_on(async {
                    // Initialize WGPU
                    println!("Initializing WGPU...");
                    let mut wgpu_state = WgpuState::new();
                    match wgpu_state.initialize().await {
                        Ok(_) => {
                            let mut state = state_clone.lock().unwrap();
                            state.wgpu_initialized = true;
                            state.message = "WGPU initialized successfully".to_string();
                            println!("WGPU initialization complete");
                        }
                        Err(e) => {
                            let mut state = state_clone.lock().unwrap();
                            state.message = format!("WGPU initialization failed: {}", e);
                            println!("WGPU initialization failed: {}", e);
                            return;
                        }
                    }
                    
                    // Small delay to simulate WebView2 initialization
                    std::thread::sleep(std::time::Duration::from_millis(500));
                    
                    // Mark WebView2 as initialized
                    {
                        let mut state = state_clone.lock().unwrap();
                        state.webview_initialized = true;
                        state.message = "All systems ready!".to_string();
                    }
                    
                    println!("All initialization complete, showing window");
                    
                    // Show the window now that everything is ready
                    window_clone.set_visible(true);
                    window_clone.set_title("Workspace");
                });
            });
            
            // Create WebView2 immediately but window stays hidden
            self.create_webview(&window);
            self.initialization_complete = true;
        }
    }

    fn window_event(&mut self, event_loop: &ActiveEventLoop, _window_id: WindowId, event: WindowEvent) {
        match event {
            WindowEvent::CloseRequested => {
                event_loop.exit();
            }
            _ => {}
        }
    }
}

impl App {
    fn create_webview(&mut self, window: &Arc<Window>) {
        let state_clone = self.state.clone();
        
        #[cfg(debug_assertions)]
        {
            println!("Running in DEBUG mode");
            println!("Frontend dev server: {}", DEV_SERVER_URL);
            println!("Make sure to run 'bun run dev' or 'npm run dev' in the www directory!");
        }

        #[cfg(not(debug_assertions))]
        println!("Running in RELEASE mode with embedded assets");

        let mut webview_builder = WebViewBuilder::new();

        // In debug mode, use dev server. In release, use embedded HTML
        #[cfg(debug_assertions)]
        {
            webview_builder = webview_builder.with_url(DEV_SERVER_URL);
        }

        #[cfg(not(debug_assertions))]
        {
            webview_builder = webview_builder.with_html(INDEX_HTML);
        }

        // Add initialization script to disable WebView2 context menu
        webview_builder = webview_builder
            .with_initialization_script(
                r#"
                // Disable WebView2 context menu and handle right-click
                document.addEventListener('contextmenu', function(e) {
                    e.preventDefault();
                    
                    // Send coordinates to Rust for Win32 context menu
                    if (window.ipc && window.ipc.postMessage) {
                        window.ipc.postMessage(JSON.stringify({
                            action: 'show_context_menu',
                            x: e.screenX,
                            y: e.screenY
                        }));
                    }
                });
                "#
            );

        #[cfg(windows)]
        let window_handle = {
            use windows::Win32::Foundation::HWND;
            use winit::raw_window_handle::{HasWindowHandle, RawWindowHandle};
            
            match window.window_handle().unwrap().as_raw() {
                RawWindowHandle::Win32(handle) => HWND(handle.hwnd.get() as *mut std::ffi::c_void),
                _ => panic!("Expected Win32 window handle"),
            }
        };

        // Initialize DWM theme for the main window
        #[cfg(windows)]
        {
            if let Err(e) = context_menu::init_window_theme(window_handle) {
                println!("Warning: Failed to initialize window theme: {:?}", e);
            }
        }

        let webview = webview_builder
            .with_ipc_handler(move |request: http::Request<String>| {
                let body = request.body();
                
                // Try to parse as JSON for context menu coordinates
                if let Ok(parsed) = serde_json::from_str::<serde_json::Value>(body) {
                    if let Some(action) = parsed.get("action").and_then(|v| v.as_str()) {
                        if action == "show_context_menu" {
                            if let (Some(x), Some(y)) = (
                                parsed.get("x").and_then(|v| v.as_i64()),
                                parsed.get("y").and_then(|v| v.as_i64())
                            ) {
                                #[cfg(windows)]
                                {
                                    if let Err(e) = context_menu::show_context_menu(window_handle, x as i32, y as i32) {
                                        println!("Failed to show context menu: {:?}", e);
                                    }
                                }
                                
                                #[cfg(not(windows))]
                                {
                                    println!("Context menu requested at ({}, {})", x, y);
                                    if let Err(e) = context_menu::show_context_menu(x as i32, y as i32) {
                                        println!("Failed to show context menu: {:?}", e);
                                    }
                                }
                                return;
                            }
                        }
                    }
                }
                
                // Handle other IPC messages
                handle_ipc_message(request, state_clone.clone());
            })
            .build(&window)
            .unwrap();

        self.webview = Some(webview);
        println!("WebView2 created with Win32 context menu support");
    }
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let event_loop = EventLoop::new()?;
    
    let mut app = App::new();

    event_loop.run_app(&mut app)?;
    
    Ok(())
}
