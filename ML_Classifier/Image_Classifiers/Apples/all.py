import subprocess

# Define the paths to your scripts clearly
scripts = [
    "./Image_Classifiers/Apples/MobileNetV2.py",
    "./Image_Classifiers/Apples/EfficientNetB0.py",
    "./Image_Classifiers/Apples/ResNet50.py"
]

# Run each Python script sequentially and clearly print results
for script in scripts:
    print(f"\n🚀 Running {script}...\n")
    result = subprocess.run(["python", script], capture_output=True, text=True)

    # Print output clearly
    print(result.stdout)
    if result.stderr:
        print(f"❗️ Error running {script}:")
        print(result.stderr)
