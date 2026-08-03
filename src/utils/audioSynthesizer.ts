// Audio player configured strictly for LANY - "you" track

class RomanticAudioEngine {
  private isPlaying: boolean = false;
  private htmlAudio: HTMLAudioElement | null = null;

  public initHTMLAudio(url: string, startTime = 0) {
    if (this.htmlAudio) {
      this.htmlAudio.pause();
    }
    this.htmlAudio = new Audio(url);
    this.htmlAudio.loop = true;
    this.htmlAudio.volume = 0.75;

    if (startTime > 0) {
      this.htmlAudio.currentTime = startTime;
    }
  }

  public async playUrl(url: string): Promise<boolean> {
    this.stop();
    if (!url || url.trim() === '') return false;

    let targetUrl = url.trim();

    // Smart resolution for AnyToURL landing page links
    if (targetUrl.includes('anytourl.com/s/85137733809978122')) {
      targetUrl = 'https://assets.anytourl.com/uploads/d3deb9196e20a4e9ae564a2e74839199.mp3';
    } else if (targetUrl.includes('anytourl.com/s/')) {
      try {
        const res = await fetch(targetUrl);
        const text = await res.text();
        const match = text.match(/https:\/\/assets\.anytourl\.com\/uploads\/[a-zA-Z0-9_-]+\.(mp3|wav|ogg|m4a)/i);
        if (match && match[0]) {
          targetUrl = match[0];
        }
      } catch (e) {
        console.warn('Failed to resolve AnyToURL direct link:', e);
      }
    }

    try {
      this.initHTMLAudio(targetUrl, 0);
      if (this.htmlAudio) {
        this.htmlAudio.onerror = () => {
          console.warn('Audio load error');
          this.isPlaying = false;
        };
        await this.htmlAudio.play();
        this.isPlaying = true;
        return true;
      }
      return false;
    } catch (err) {
      console.warn('HTML Audio playback failed', err);
      this.isPlaying = false;
      return false;
    }
  }

  public async togglePlay(customUrl?: string): Promise<boolean> {
    if (this.isPlaying) {
      this.stop();
      return false;
    }

    if (customUrl) {
      return this.playUrl(customUrl);
    }
    return false;
  }

  public stop() {
    this.isPlaying = false;
    if (this.htmlAudio) {
      this.htmlAudio.pause();
    }
  }

  public getStatus() {
    return {
      isPlaying: this.isPlaying,
      isSynthMode: false,
    };
  }
}

export const audioEngine = new RomanticAudioEngine();


