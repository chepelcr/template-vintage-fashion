import React from 'react';
import { Link } from 'wouter';
import { Mail, MapPin, MessageCircle, Facebook, Instagram, Twitter } from 'lucide-react';
import { formatPhone, whatsappPhone, whatsappUrl } from '@chepelcr/tsuru-storefront-sdk';
import { useContact } from '@/hooks/useContent';
import { useSubdomainContext } from '@/contexts/SubdomainContext';
import { VintageDivider } from '../VintageDivider';
import { OrnateBorder } from '../OrnateBorder';

export function Footer() {
  const { data: contact } = useContact();
  const { organization } = useSubdomainContext();
  const storeWhatsapp = whatsappPhone(contact);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-burgundy-900 text-cream-50 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <OrnateBorder variant="decorative" className="bg-burgundy-800/50 mb-12">
          <div className="text-center">
            <h3 className="text-2xl font-serif font-bold mb-2">Join Our Newsletter</h3>
            <p className="text-cream-50/80 font-body mb-6 italic">
              Receive exclusive offers and vintage fashion inspiration
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Ingresa tu correo"
                className="flex-1 px-4 py-3 rounded-md bg-cream-50 text-burgundy-900 font-body placeholder:text-burgundy-900/50 border-2 border-transparent focus:border-mustard-500 outline-none"
              />
              <button className="px-6 py-3 bg-mustard-500 text-burgundy-900 font-serif font-semibold tracking-wider uppercase rounded-md hover:bg-mustard-600 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </OrnateBorder>

        <VintageDivider className="border-cream-50/20" />

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h4 className="text-xl font-serif font-bold mb-4">{organization?.name}</h4>
            {organization?.description && (
              <p className="text-cream-50/80 font-body text-sm mb-4 leading-relaxed">
                {organization.description}
              </p>
            )}
            <p className="text-xs font-body text-cream-50/60 italic">
              "Fashion fades, style is eternal"
            </p>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-lg font-serif font-bold mb-4">Shop</h4>
            <ul className="space-y-2 font-body text-sm">
              <li>
                <Link href="/products">
                  <a className="text-cream-50/80 hover:text-mustard-500 transition-colors">
                    New Arrivals
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/products">
                  <a className="text-cream-50/80 hover:text-mustard-500 transition-colors">
                    Dresses
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/products">
                  <a className="text-cream-50/80 hover:text-mustard-500 transition-colors">
                    Coats & Jackets
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/products">
                  <a className="text-cream-50/80 hover:text-mustard-500 transition-colors">
                    Accessories
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/products">
                  <a className="text-cream-50/80 hover:text-mustard-500 transition-colors">
                    Sale Items
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-serif font-bold mb-4">Customer Service</h4>
            <ul className="space-y-2 font-body text-sm">
              <li>
                <a href="#" className="text-cream-50/80 hover:text-mustard-500 transition-colors">
                  Acerca de Nosotros
                </a>
              </li>
              <li>
                <a href="#" className="text-cream-50/80 hover:text-mustard-500 transition-colors">
                  Contáctanos
                </a>
              </li>
              <li>
                <a href="#" className="text-cream-50/80 hover:text-mustard-500 transition-colors">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#" className="text-cream-50/80 hover:text-mustard-500 transition-colors">
                  Returns & Exchanges
                </a>
              </li>
              <li>
                <a href="#" className="text-cream-50/80 hover:text-mustard-500 transition-colors">
                  Size Guide
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-serif font-bold mb-4">Contact</h4>
            <ul className="space-y-3 font-body text-sm">
              {contact?.address && (
                <li className="flex items-start gap-2">
                  <MapPin size={16} className="mt-1 flex-shrink-0 text-mustard-500" />
                  <span className="text-cream-50/80">{contact.address}</span>
                </li>
              )}
              {storeWhatsapp && (
                <li className="flex items-center gap-2">
                  <MessageCircle size={16} className="flex-shrink-0 text-mustard-500" />
                  <a
                    href={whatsappUrl(storeWhatsapp, 'Hola, me gustaría obtener más información')} target="_blank" rel="noopener noreferrer"
                    className="text-cream-50/80 hover:text-mustard-500 transition-colors"
                  >
                    {formatPhone(storeWhatsapp)}
                  </a>
                </li>
              )}
              {contact?.email && (
                <li className="flex items-center gap-2">
                  <Mail size={16} className="flex-shrink-0 text-mustard-500" />
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-cream-50/80 hover:text-mustard-500 transition-colors"
                  >
                    {contact.email}
                  </a>
                </li>
              )}
            </ul>

            {/* Social Media */}
            <div className="flex gap-4 mt-6">
              {contact?.facebookUrl && (
                <a href={contact.facebookUrl} target="_blank" rel="noopener noreferrer"
                className="text-cream-50/80 hover:text-mustard-500 transition-colors"
                aria-label="Facebook"
              >
                  <Facebook size={20} />
                </a>
              )}
              {contact?.instagramUrl && (
                <a href={contact.instagramUrl} target="_blank" rel="noopener noreferrer"
                className="text-cream-50/80 hover:text-mustard-500 transition-colors"
                aria-label="Instagram"
              >
                  <Instagram size={20} />
                </a>
              )}
              {contact?.twitterUrl && (
                <a href={contact.twitterUrl} target="_blank" rel="noopener noreferrer"
                className="text-cream-50/80 hover:text-mustard-500 transition-colors"
                aria-label="Twitter"
              >
                  <Twitter size={20} />
                </a>
              )}
            </div>
          </div>
        </div>

        <VintageDivider className="border-cream-50/20" />

        {/* Bottom Bar */}
        <div className="text-center">
          <p className="text-sm text-cream-50/60 font-body mb-2">
            © {currentYear} {organization?.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-cream-50/50 font-body">
            <a href="#" className="hover:text-mustard-500 transition-colors">
              Política de Privacidad
            </a>
            <span>•</span>
            <a href="#" className="hover:text-mustard-500 transition-colors">
              Terms of Service
            </a>
            <span>•</span>
            <a href="#" className="hover:text-mustard-500 transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
