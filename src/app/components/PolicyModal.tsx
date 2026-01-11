import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'privacy' | 'terms' | 'refund' | 'shipping' | 'returns' | 'faq' | 'size-guide' | null;
}

export default function PolicyModal({ isOpen, onClose, type }: PolicyModalProps) {
  const getContent = () => {
    switch (type) {
      case 'privacy':
        return {
          title: "Privacy Policy",
          content: (
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>Welcome to Soft Girl Core. Your privacy is of the utmost importance to us. This Privacy Policy outlines how we collect, use, and protect your personal information.</p>
              
              <h4 className="font-semibold text-foreground">1. Information Collection</h4>
              <p>We collect information you provide directly to us when you create an account, make a purchase, or contact our support team. This may include your name, email address, shipping address, and payment information.</p>
              
              <h4 className="font-semibold text-foreground">2. Use of Information</h4>
              <p>We use your information to process orders, provide customer support, and send you updates about our latest arrivals and special offers (with your consent).</p>
              
              <h4 className="font-semibold text-foreground">3. Data Protection</h4>
              <p>We implement industry-standard security measures to safeguard your personal data. Your payment information is processed through secure, encrypted gateways.</p>
              
              <h4 className="font-semibold text-foreground">4. Third-Party Services</h4>
              <p>We do not sell your personal information. We may share data with trusted third-party partners (like shipping carriers) solely to fulfill your orders.</p>
              
              <h4 className="font-semibold text-foreground">5. Your Rights</h4>
              <p>You have the right to access, update, or delete your personal information at any time through your account settings or by contacting us.</p>
            </div>
          )
        };
      case 'terms':
        return {
          title: "Terms of Service",
          content: (
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>By accessing Soft Girl Core, you agree to comply with and be bound by the following terms and conditions.</p>
              
              <h4 className="font-semibold text-foreground">1. General Conditions</h4>
              <p>We reserve the right to refuse service to anyone for any reason at any time. Prices for our products are subject to change without notice.</p>
              
              <h4 className="font-semibold text-foreground">2. Products and Services</h4>
              <p>We make every effort to display the colors and images of our products as accurately as possible. We cannot guarantee that your computer monitor's display of any color will be accurate.</p>
              
              <h4 className="font-semibold text-foreground">3. Accuracy of Billing</h4>
              <p>You agree to provide current, complete, and accurate purchase and account information for all purchases made at our store.</p>
              
              <h4 className="font-semibold text-foreground">4. User Comments</h4>
              <p>If you send us creative ideas, suggestions, or other materials, you agree that we may, at any time, without restriction, edit, copy, publish, and distribute them.</p>
              
              <h4 className="font-semibold text-foreground">5. Governing Law</h4>
              <p>These Terms of Service shall be governed by and construed in accordance with the laws of the jurisdiction in which we operate.</p>
            </div>
          )
        };
      case 'refund':
      case 'returns': // Reuse refund content for returns & exchanges as they are closely related
        return {
          title: "Returns & Refund Policy",
          content: (
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>We want you to love your Soft Girl Core purchases! If you're not completely satisfied, here's our refund and return policy.</p>
              
              <h4 className="font-semibold text-foreground">1. Returns Window</h4>
              <p>Items must be returned within 14 days of receipt. To be eligible for a return, your item must be unused and in the same condition that you received it, with original tags attached.</p>
              
              <h4 className="font-semibold text-foreground">2. Non-Returnable Items</h4>
              <p>For hygiene reasons, certain items such as earrings, hair accessories, and opened beauty products cannot be returned unless defective.</p>
              
              <h4 className="font-semibold text-foreground">3. Refunds Process</h4>
              <p>Once your return is received and inspected, we will notify you of the approval or rejection of your refund. If approved, your refund will be processed to your original method of payment within 5-10 business days.</p>
              
              <h4 className="font-semibold text-foreground">4. Shipping Costs</h4>
              <p>You will be responsible for paying for your own shipping costs for returning your item. Original shipping costs are non-refundable.</p>
              
              <h4 className="font-semibold text-foreground">5. Exchanges</h4>
              <p>We only replace items if they are defective or damaged. If you need to exchange it for the same item, please contact our support team.</p>
            </div>
          )
        };
      case 'shipping':
        return {
          title: "Shipping Information",
          content: (
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>We ship worldwide to bring the soft girl aesthetic to every corner of the globe!</p>
              
              <h4 className="font-semibold text-foreground">1. Processing Time</h4>
              <p>All orders are processed within 1-3 business days. You will receive a confirmation email once your order has shipped.</p>
              
              <h4 className="font-semibold text-foreground">2. Domestic Shipping</h4>
              <p>Standard shipping takes 3-5 business days. Express shipping is available for delivery within 1-2 business days.</p>
              
              <h4 className="font-semibold text-foreground">3. International Shipping</h4>
              <p>International shipping typically takes 7-14 business days, depending on the destination. Customs fees may apply and are the responsibility of the customer.</p>
              
              <h4 className="font-semibold text-foreground">4. Tracking</h4>
              <p>Once your order ships, you will receive a tracking number to monitor your package's journey.</p>
            </div>
          )
        };
      case 'faq':
        return {
          title: "Frequently Asked Questions",
          content: (
            <div className="space-y-4 text-sm text-muted-foreground">
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Q: How do I track my order?</h4>
                <p>A: You can track your order using the tracking number provided in your shipping confirmation email.</p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Q: Can I cancel my order?</h4>
                <p>A: You can cancel your order within 24 hours of placing it. Please contact us immediately if you need to make changes.</p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Q: Do you restock sold-out items?</h4>
                <p>A: Yes! We frequently restock popular items. Sign up for our newsletter to get notified when your favorites are back.</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Q: Are your products sustainable?</h4>
                <p>A: We are committed to sustainability and are constantly working to improve our eco-friendly practices, from packaging to sourcing.</p>
              </div>
            </div>
          )
        };
      case 'size-guide':
        return {
          title: "Size Guide",
          content: (
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>Find your perfect fit! Measurements are in inches.</p>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-pink-100">
                      <th className="py-2 text-foreground font-semibold">Size</th>
                      <th className="py-2 text-foreground font-semibold">Bust</th>
                      <th className="py-2 text-foreground font-semibold">Waist</th>
                      <th className="py-2 text-foreground font-semibold">Hips</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-pink-50">
                      <td className="py-2">XS</td>
                      <td className="py-2">30-32"</td>
                      <td className="py-2">24-25"</td>
                      <td className="py-2">34-35"</td>
                    </tr>
                    <tr className="border-b border-pink-50">
                      <td className="py-2">S</td>
                      <td className="py-2">33-34"</td>
                      <td className="py-2">26-27"</td>
                      <td className="py-2">36-37"</td>
                    </tr>
                    <tr className="border-b border-pink-50">
                      <td className="py-2">M</td>
                      <td className="py-2">35-36"</td>
                      <td className="py-2">28-29"</td>
                      <td className="py-2">38-39"</td>
                    </tr>
                    <tr className="border-b border-pink-50">
                      <td className="py-2">L</td>
                      <td className="py-2">37-39"</td>
                      <td className="py-2">30-32"</td>
                      <td className="py-2">40-42"</td>
                    </tr>
                     <tr>
                      <td className="py-2">XL</td>
                      <td className="py-2">40-42"</td>
                      <td className="py-2">33-35"</td>
                      <td className="py-2">43-45"</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs mt-2">*Measurements are general guidelines. Fit may vary by style and material.</p>
            </div>
          )
        };
      default:
        return { title: "", content: null };
    }
  };

  const { title, content } = getContent();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl border-pink-100 bg-white/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent" style={{ fontFamily: 'Playfair Display, serif' }}>
            {title}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          {content}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
