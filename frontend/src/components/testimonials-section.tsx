import SectionHead from "@/components/site/section-head";
import { Testimonial } from "@/components/ui/design-testimonial";
import { TESTIMONIALS } from "@/lib/testimonials";

export default function TestimonialsSection() {
  if (!TESTIMONIALS.length) return null;

  return (
    <section aria-labelledby="testimonials" className="border-t border-white/[0.08] bg-black py-24 md:py-32">
      <div className="container-wide">
        <SectionHead label="In their words" title={<span id="testimonials">What our clients say</span>} />
        <div className="mt-16">
          <Testimonial testimonials={TESTIMONIALS} />
        </div>
      </div>
    </section>
  );
}
