import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const title = searchParams.get('title') || 'Headway Trips';
  const subtitle = searchParams.get('subtitle') || 'Agencia de viajes internacional · Europa y el mundo';
  const destination = searchParams.get('destination') || '';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px',
          background: 'linear-gradient(135deg, #1a365d 0%, #2d4a6f 50%, #1a365d 100%)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Decorative elements */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(201,169,98,0.3) 0%, transparent 70%)',
            borderRadius: '50%',
            transform: 'translate(100px, -100px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(201,169,98,0.2) 0%, transparent 70%)',
            borderRadius: '50%',
            transform: 'translate(-100px, 100px)',
          }}
        />
        
        {/* Top section with logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '12px',
              background: '#c9a962',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              fontWeight: 700,
              color: '#1a365d',
            }}
          >
            H
          </div>
          <span style={{ color: '#ffffff', fontSize: '28px', fontWeight: 600 }}>
            Headway Trips
          </span>
        </div>

        {/* Main content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {destination && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(201,169,98,0.2)',
                borderRadius: '24px',
                padding: '8px 20px',
                width: 'fit-content',
              }}
            >
              <span style={{ color: '#c9a962', fontSize: '18px' }}>📍</span>
              <span style={{ color: '#c9a962', fontSize: '18px', fontWeight: 500 }}>
                {destination}
              </span>
            </div>
          )}
          
          <h1
            style={{
              margin: 0,
              fontSize: '64px',
              fontWeight: 700,
              color: '#ffffff',
              lineHeight: 1.1,
              maxWidth: '900px',
            }}
          >
            {title}
          </h1>
          
          <p
            style={{
              margin: 0,
              fontSize: '28px',
              color: 'rgba(255,255,255,0.8)',
              maxWidth: '700px',
              lineHeight: 1.4,
            }}
          >
            {subtitle}
          </p>
        </div>

        {/* Bottom accent bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              height: '4px',
              width: '120px',
              background: 'linear-gradient(90deg, #c9a962 0%, transparent 100%)',
              borderRadius: '2px',
            }}
          />
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '18px' }}>
            headwaytrips.com
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
