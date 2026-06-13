import time
import webbrowser
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def main():
    print("=" * 50)
    print("AUTO CLICKER - Ponto Mais")
    print("=" * 50)
    
    print("\n🌐 Abrindo página no Brave...")
    webbrowser.open("https://app2.pontomais.com.br/registrar-ponto")
    
    print("⏳ Aguardando carregamento (4 segundos)...")
    time.sleep(4)
    
    try:
        print("🔄 Conectando ao Brave...")
        options = webdriver.ChromeOptions()
        options.add_experimental_option("debuggerAddress", "127.0.0.1:9222")
        
        from webdriver_manager.chrome import ChromeDriverManager
        from selenium.webdriver.chrome.service import Service
        
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=options)
        
        wait = WebDriverWait(driver, 10)
        
        # 1. Encontrar e clicar no X
        print("1️⃣ Procurando X do pop-up...")
        try:
            # Procura pelo SVG com as classes w-6 h-6
            x_button = wait.until(
                EC.element_to_be_clickable((By.XPATH, "//svg[@class='w-6 h-6']")),
                timeout=5
            )
            print("   ✓ X encontrado! Clicando...")
            x_button.click()
            time.sleep(1)
        except:
            print("   ⚠️  X não encontrado, continuando...")
        
        # 2. Aceitar localização (automático)
        print("2️⃣ Aceitando localização...")
        driver.execute_cdp_cmd('Browser.grantPermissions', {
            "origin": "https://app2.pontomais.com.br",
            "permissions": ["geolocation"]
        })
        time.sleep(2)
        
        # 3. Clicar em "editar localização"
        print("3️⃣ Procurando 'editar localização'...")
        botao = wait.until(
            EC.element_to_be_clickable((By.XPATH, "//*[contains(text(), 'editar localização')]"))
        )
        print("   ✓ Botão encontrado! Clicando...")
        botao.click()
        print("\n✓ Sucesso!")
        
    except Exception as e:
        print(f"❌ Erro: {e}")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n❌ Cancelado")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n❌ Script cancelado pelo usuário")
